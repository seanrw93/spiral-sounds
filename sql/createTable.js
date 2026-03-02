import { pool } from "../db/db.js";
import dotenv from "dotenv";
dotenv.config();

export const createTable = async () => {
   console.log("POOL CONFIG:", pool.options);

    try {
        await pool.query(
            // `
            //     CREATE TABLE IF NOT EXISTS products(
            //         id SERIAL PRIMARY KEY,
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
            //         id SERIAL PRIMARY KEY,
            //         name VARCHAR(100) NOT NULL,
            //         username VARCHAR(100) NOT NULL,
            //         email VARCHAR(100) NOT NULL,
            //         password VARCHAR(100) NOT NULL,
            //         created_at TIMESTAMPTZ DEFAULT NOW()
            //     )
            // `


            `
                CREATE TABLE IF NOT EXISTS cart_items(
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER NOT NULL,
                    product_id INTEGER NOT NULL,
                    quantity INTEGER NOT NULL DEFAULT 1,
                    FOREIGN KEY (user_id) REFERENCES users(id),
                    FOREIGN KEY (product_id) REFERENCES products(id) 
                )
            `
        );
    } catch (err) {
        console.log("Unable to create table", err);
    } 
}

createTable();