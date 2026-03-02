import { getDBConnection } from "../db/db.js";

export const createTable = async () => {
    const db = await getDBConnection();

    try {
        await db.exec(
            // `
            //     CREATE TABLE IF NOT EXISTS products(
            //         id INTEGER PRIMARY KEY AUTOINCREMENT,
            //         title VARCHAR(100) NOT NULL,
            //         artist VARCHAR(100) NOT NULL,
            //         price DECIMAL(10, 2) NOT NULL,
            //         image TEXT NOT NULL,
            //         year INTEGER,
            //         genre VARCHAR(100),
            //         stock INTEGER
            //     )
            // `


            // `
            //     CREATE TABLE IF NOT EXISTS users(
            //         id INTEGER PRIMARY KEY AUTOINCREMENT,
            //         name VARCHAR(100) NOT NULL,
            //         username VARCHAR(100) NOT NULL,
            //         email VARCHAR(100) NOT NULL,
            //         password VARCHAR(100) NOT NULL,
            //         created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            //     )
            // `


            // `
            //     CREATE TABLE IF NOT EXISTS cart_items(
            //         id INTEGER PRIMARY KEY AUTOINCREMENT,
            //         user_id INTEGER NOT NULL,
            //         product_id INTEGER NOT NULL,
            //         quantity INTEGER NOT NULL DEFAULT 1,
            //         FOREIGN KEY (user_id) REFERENCES user(id),
            //         FOREIGN KEY (product_id) REFERENCES products(id) 
            //     )
            // `
        );
    } catch (err) {
        console.log("Unable to create table", err);
    } finally {
        await db.close();
    }
}

createTable();