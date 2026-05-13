import { pool } from "../db/db.js";

export const getCurrentUser = async (req, res) => {

    if (process.env.NODE_ENV = "production") {
         //Prevent browser + CDN auth caching
        res.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        res.set("Pragma", "no-cache");
        res.set("Expires", "0");
    }

    const { userId } = req.session;

    try {
        if (!userId) {
            return res.json({ isLoggedIn: false});
        }

        const result = await pool.query('SELECT name FROM users WHERE id = $1', [userId]);
        const user = result.rows[0];

        if (!user) {
            return res.json({ isLoggedIn: false }); 
        }

        res.json({ isLoggedIn: true, name: user.name});
    } catch (err) {
        console.error('getCurrentUser error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}

export const getAccount = async (req, res) => {
    const { userId } = req.session;

    try {
        const result = await pool.query(
            'SELECT name, username, email, created_at FROM users WHERE id = $1',
            [userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error('getAccount error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
}