import { pool } from "../db/db.js";

export const viewAllProducts = async () => {

    try {
        const orders = await pool.query('SELECT * FROM orders')
        console.table(orders.rows)
    } catch (err) {
        console.log("Unable to log table", err)
    }
}

viewAllProducts();