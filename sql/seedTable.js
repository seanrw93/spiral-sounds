import { getDBConnection } from "../db/db.js";
import { vinyls } from "../data/data.js";

export const seedTable = async () => {
    const db = await getDBConnection();

    try {
        await db.exec('BEGIN TRANSACTION');

        for (const { artist, title, price, image, year, genre, stock } of vinyls) {
            await db.run(
                `
                    INSERT INTO PRODUCTS(artist, title, price, image, year, genre, stock)
                    VALUES (?,?,?,?,?,?,?)
                `, [artist, title, price, image, year, genre, stock]
            )
        }

        await db.exec('COMMIT');
        console.log('All records inserted successfully.')
    } catch (err) {
        await db.exec('ROLLBACK');
        console.log("Error inserting data", err)
    } finally {
        await db.close();
    }
}

seedTable();