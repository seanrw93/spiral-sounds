import { pool } from "../db/db.js";
import { vinyls } from "../data/data.js";

export const seedTable = async () => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        for (const { artist, title, price, image, year, genre, stock } of vinyls) {
            await client.query(
                `
                    INSERT INTO PRODUCTS(artist, title, price, image, year, genre, stock)
                    VALUES ($1,$2,$3,$4,$5,$6,$7)
                `, [artist, title, price, image, year, genre, stock]
            )
        }

        await client.query('COMMIT');
        console.log('All records inserted successfully.')
    } catch (err) {
        await client.query('ROLLBACK');
        console.log("Error inserting data", err)
    } finally {
        await client.release()
    }
}

seedTable();