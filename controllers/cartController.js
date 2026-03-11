import { pool } from "../db/db.js";

export const getAll = async (req, res) => {
    const { userId } = req.session;

    try {
        const query = `
            SELECT c.id AS cartItemId, p.title, c.quantity, p.price
            FROM cart_items c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = $1;
        `;

        const result = await pool.query(query, [userId]);
        const items = result.rows
        res.json({ items });
     } catch (err) {
        res.status(500).json({ error: "Error fetching cart items", details: err})
     } 
}

export const addToCart = async (req, res) => {
    const { userId } = req.session;
    const productId = Number(req.body.productId);

    if (!productId || isNaN(productId)) {
        return res.status(400).json({ error: "Invalid product ID"}); 
    }

    try {
        //Check for duplicates
        const existingItem = await pool.query(
            'SELECT * FROM cart_items WHERE user_id = $1 AND product_id = $2', 
            [userId, productId]
        )

        if (existingItem.rowCount > 0) {
            const cartItemId = existingItem.rows[0].id
            await pool.query(
                'UPDATE cart_items SET quantity = quantity + 1 WHERE id= $1',
                [cartItemId]
            )
        } else {
            const query = 'INSERT INTO cart_items(user_id, product_id, quantity) VALUES ($1, $2, $3)'
            await pool.query(query, [userId, productId, 1]);
        }

        res.json({message: "Item added to cart successfully"})
    } catch (err) {
        res.status(500).json({ error: "Error adding item to cart", details: err})
    }
}

export const deleteAll = async (req, res) => {
    const { userId } = req.session;

    try {
        const selectItemsQuery = 'SELECT * FROM cart_items WHERE user_id = $1';
        const items = await pool.query(selectItemsQuery, [userId])

        if (items.rowCount === 0) {
            return res.status(400).json({ error: "No items found"})
        }

        const deleteItemsQuery = 'DELETE FROM cart_items WHERE user_id = $1';
        await pool.query(deleteItemsQuery, [userId]);

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: `Error deleting all cart items for user with id ${userId}`, details: err})
    } 
}

export const deleteItem = async (req, res) => {
    const { userId } = req.session;
    const { itemId } = req.params;

    if (!itemId) {
       return res.status(400).json({ error: "Item ID not found"})
    }

    try {
        const result = await pool.query('SELECT quantity FROM cart_items WHERE id = $1 AND user_id = $2', [itemId, userId]);

        if (result.rowCount === 0) {
            return res.status(404).json({error: 'Item not found'});
        }

        await pool.query('DELETE FROM cart_items WHERE id = $1 AND user_id = $2', [itemId, userId]);
        console.log(`Item with ID ${itemId} deleted successfully`);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: `Error deleting cart item with id ${itemId}`, details: err});
    } 
}

export const getCartCount = async (req, res) => {
    const { userId } = req.session;

    try {
        const query = 'SELECT COALESCE(SUM(quantity), 0) AS "totalItems" FROM cart_items WHERE user_id = $1';
        const result = await pool.query(query, [userId]);
        const totalItemsCount = result.rows[0].totalItems;
        res.json({ totalItems: totalItemsCount });
    } catch (err) {
        res.status(500).json({ error: "Error fetching cart count", details: err});
    } 
}