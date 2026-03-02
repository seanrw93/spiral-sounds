import { getDBConnection } from "../db/db.js";

export const getProducts = async (req, res) => {
    const db = await getDBConnection();

    try {
        const { genre, search } = req.query;
        let query = `SELECT * FROM products `;
        let params = [];

        if (genre) {
            query += `WHERE genre = ?`;
            params.push(genre);
        } else if (search) {
            query += `WHERE artist LIKE ? OR title LIKE ? OR genre LIKE ?`;
            const searchPattern = `%${search}%`;
            params.push(searchPattern, searchPattern, searchPattern);
        }

        const products = await db.all(query, params);

        if (products.length === 0) {
            return res.status(404).json({ message: "No products found matching the criteria" });
        }

        res.json( products );
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

export const getGenres = async (req, res) => {
    const db = await getDBConnection();

    try {
        const genreRows = await db.all(`SELECT DISTINCT genre FROM products`);
        const mappedGenres = genreRows.map(row => row.genre);
        res.json(mappedGenres);
    } catch (err) {
        res.status(500).json({ error: err.message})
    }
}