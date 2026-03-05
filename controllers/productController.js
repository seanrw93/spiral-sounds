import { pool } from "../db/db.js";

export const getProducts = async (req, res) => {

    try {
        const { genre, search } = req.query;
        let query = `SELECT * FROM products `;
        let params = [];

        if (genre) {
            query += `WHERE genre = $1`;
            params.push(genre);
        } else if (search) {
            query += `WHERE artist ILIKE $1 OR title ILIKE $2 OR genre ILIKE $3`;
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern, searchPattern);
        }

        const products = await pool.query(query, params);

        if (products.rows.length === 0) {
            return res.status(404).json({ message: "No products found matching the criteria" });
        }

        res.json( products.rows );
    } catch (err) {
        res.status(500).json({ error: "Error loading products", details: err })
    }
}

export const getGenres = async (req, res) => {
    try {
        const genreRows = await pool.query(`SELECT DISTINCT genre FROM products`);
        const mappedGenres = genreRows.rows.map(row => row.genre);
        res.json(mappedGenres);
    } catch (err) {
        res.status(500).json({ error: err.message})
    }
}