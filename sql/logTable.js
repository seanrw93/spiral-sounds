import { pool } from "../db/db.js";

export const viewAllProducts = async () => {

    try {
        const products = await pool.query('SELECT * FROM products')
        console.table(products.rows)
    } catch (err) {
        console.log("Unable to log table", err)
    }
}

viewAllProducts();