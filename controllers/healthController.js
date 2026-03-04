import { pool } from "../db/db.js";

export const getHealth = async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.status(200).json({
            status: "ok",
            db: "connected"
        })
    } catch (err) {
        res.status(500).json({
            status: "error",
            db: "down"
        })
    }
}