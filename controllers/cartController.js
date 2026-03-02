import { getDBConnection } from "../db/db.js";

export const getAll = async (req, res) => {
    const { userId } = req.session;

    const db = await getDBConnection();

    try {
        const query = `
            SELECT c.id AS cartItemId, p.title, c.quantity, p.price
            FROM cart_items c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?;
        `;

        const items = await db.all(query, [userId])
        res.json({ items });
     } catch (err) {
        res.status(500).json({ error: "Error fetching cart items", details: err})
     } finally {
        await db.close();
     }
}

export const addToCart = async (req, res) => {
    const { userId } = req.session;
    const productId = Number(req.body.productId);

    if (!productId || isNaN(productId)) {
        return res.json(400).json({ error: "Invalid product ID"}); 
    }

    const db = await getDBConnection();

    try {
        //Check for duplicates
        const existingItem = await db.get(
            'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?', 
            [userId, productId]
        )

        if (existingItem) {
            await db.run(
                'UPDATE cart_items SET quantity = quantity + 1 WHERE id= ?',
                [existingItem.id]
            )
        } else {
            const query = 'INSERT INTO cart_items(user_id, product_id, quantity) VALUES (?, ?, ?)'
            await db.run(query, [userId, productId, 1]);
        }

        res.json({message: "Item added to cart successfully"})
    } catch (err) {
        res.status(500).json({ error: "Error adding item to cart", details: err})
    } finally {
        await db.close();
    }
}

export const deleteAll = async (req, res) => {
    const { userId } = req.session;

    const db = await getDBConnection();

    try {
        const selectItemsQuery = 'SELECT * FROM cart_items WHERE user_id = ?';
        const items = await db.all(selectItemsQuery, [userId])

        if (items.length === 0) {
            return res.status(400).json({ error: "No items found"})
        }

        const deleteItemsQuery = 'DELETE FROM cart_items WHERE user_id = ?';
        await db.run(deleteItemsQuery, [userId]);

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: `Error deleting all cart items for user with id ${userId}`, details: err})
    } finally {
        await db.close();
    } 

}

export const deleteItem = async (req, res) => {
    const { userId } = req.session;
    const { itemId } = req.params;

    const db = await getDBConnection();

    try {
        const item = await db.get('SELECT quantity FROM cart_items WHERE id = ? AND user_id = ?', [itemId, req.session.userId])

        if (!item) {
            return res.status(40).json({error: 'Item not found'})
        }

        await db.run('DELETE FROM cart_items WHERE id = ? AND user_id = ?', [itemId, req.session.userId])
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: `Error deleting cart item with id ${itemId}`, details: err})
    } finally {
        await db.close();
    }
}

export const getCartCount = async (req, res) => {
    const { userId } = req.session;

    const db = await getDBConnection();

    try {
        const query = 'SELECT SUM(quantity) AS totalItems FROM cart_items WHERE user_id = ?';
        const result = await db.get(query, [userId]);
        console.log(result)
        res.json({ totalItems: result.totalItems || 0})
    } catch (err) {
        res.status(500).json({ error: "Error fetching cart count", details: err})
    } finally {
        await db.close();
    }
}