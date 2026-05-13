import { pool } from "../db/db.js";
import { generateOrderNumber } from "../utils/orderNumber.js";


export const createOrder = async (req, res) => {
    const { userId } = req.session;

    try {
        await pool.query('BEGIN');

        //Fetch cart items with product details
        const cartItems = await pool.query(
            `
                SELECT 
                    p.id AS product_id, 
                    p.title AS product_title, 
                    p.artist AS artist, 
                    p.price as price,
                    p.image as album_cover,
                    c.quantity as quantity
                FROM cart_items c
                JOIN products p ON c.product_id = p.id
                WHERE c.user_id = $1;
            `, [userId]
        );

        if (cartItems.rowCount === 0) {
            await pool.query('ROLLBACK');
            return res.status(400).json({ error: "Error creating order - cart is empty", success: false})
        }

        //Compute total price
        const totalResult = await pool.query(
            `
                SELECT SUM(p.price * c.quantity) AS total_price
                FROM cart_items c
                JOIN products p ON c.product_id = p.id
                WHERE c.user_id = $1;
            `, [userId]
        );

        const totalPrice = totalResult.rows[0].total_price;
        const orderNumber = generateOrderNumber();

        //Insert order
        const order = await pool.query(
            `
                INSERT INTO orders (user_id, total_price, order_number)
                VALUES ($1, $2, $3)
                RETURNING id
            `, [userId, totalPrice, orderNumber]
        );

        const orderId = order.rows[0].id;

        //Insert order items
        for (const item of cartItems.rows) {
            await pool.query(
                `
                    INSERT INTO order_items (order_id, product_id, quantity)
                    VALUES ($1, $2, $3)
                `, [orderId, item.product_id, item.quantity]
            );
        }

        //Commit before sending response
        await pool.query('COMMIT');

        //Send Stripe-ready JSON
        res.status(200).json({ 
            success: true, 
            orderId, 
            orderNumber,
            totalPrice,
            items: cartItems.rows.map(items => ({
                id: items.product_id,
                productName: items.product_title,
                price: items.price,
                albumCover: items.album_cover,
                quantity: items.quantity,
            })),
        });
    } catch (err) {
        await pool.query('ROLLBACK');
        res.status(500).json({ error: "Error creating order", success: false, details: err});
    } 
}

export const getOrder = async (req, res) => {
  const { orderid } = req.params;
  const userId = req.session.userId;

  try {
    const result = await pool.query(
      `SELECT id, user_id, status, total_price, order_number, created_at
       FROM orders
       WHERE id = $1 AND user_id = $2`,
      [orderid, userId]
    );

    if (result.rowCount === 0) {
      return res.status(403).json({ error: "Not authorized to view this order" });
    }

    console.log(result.rows[0])
    res.json(result.rows[0]);

  } catch (err) {
    console.error("Error fetching order:", err);
    res.status(500).json({ error: "Server error fetching order" });
  }
}

export const getOrderHistory = async (req, res) => {
    const userId = req.session.userId;

    try {
        const result = await pool.query(
            `SELECT
                o.id,
                o.order_number,
                o.total_price,
                o.status,
                o.created_at,
                o.customer_name,
                o.shipping_city,
                o.shipping_country,
                json_agg(
                    json_build_object(
                        'title',    p.title,
                        'artist',   p.artist,
                        'image',    p.image,
                        'quantity', oi.quantity,
                        'price',    p.price
                    ) ORDER BY p.title
                ) AS items
             FROM orders o
             JOIN order_items oi ON oi.order_id = o.id
             JOIN products p     ON p.id = oi.product_id
             WHERE o.user_id = $1
             GROUP BY o.id
             ORDER BY o.created_at DESC`,
            [userId]
        );

        res.json(result.rows);
    } catch (err) {
        console.error('getOrderHistory error:', err);
        res.status(500).json({ error: 'Failed to load order history' });
    }
};

export const updateOrderPaymentStatus = async (order, status) => {
    try {
        await pool.query('UPDATE orders SET status = $1 WHERE id = $2', [status, order])
    } catch (err) {
        console.error({ error: "Unable to update order status", details: err })
    }
}

export const saveOrderAddresses = async (orderId, details) => {
  const { email, name, phone, billingAddress, shippingAddress } = details;

  await pool.query(
    `
      UPDATE orders
      SET
        customer_name = $1,
        customer_email = $2,
        customer_phone = $3,

        billing_line1 = $4,
        billing_line2 = $5,
        billing_city = $6,
        billing_postal_code = $7,
        billing_country = $8,

        shipping_line1 = $9,
        shipping_line2 = $10,
        shipping_city = $11,
        shipping_postal_code = $12,
        shipping_country = $13

      WHERE id = $14
    `,
    [
      name,
      email,
      phone,

      billingAddress?.line1 || null,
      billingAddress?.line2 || null,
      billingAddress?.city || null,
      billingAddress?.postal_code || null,
      billingAddress?.country || null,

      shippingAddress?.line1 || null,
      shippingAddress?.line2 || null,
      shippingAddress?.city || null,
      shippingAddress?.postal_code || null,
      shippingAddress?.country || null,

      orderId
    ]
  );
};
