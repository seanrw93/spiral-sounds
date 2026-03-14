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


            // `
            //     CREATE TABLE IF NOT EXISTS cart_items(
            //         id SERIAL PRIMARY KEY,
            //         user_id INTEGER NOT NULL,
            //         product_id INTEGER NOT NULL,
            //         quantity INTEGER NOT NULL DEFAULT 1,
            //         FOREIGN KEY (user_id) REFERENCES users(id),
            //         FOREIGN KEY (product_id) REFERENCES products(id) 
            //     )
            // `

            // `
                // CREATE TABLE IF NOT EXISTS orders (
                //     id SERIAL PRIMARY KEY,
                //     user_id INTEGER NOT NULL,
                //     total_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
                //     status VARCHAR(50) DEFAULT 'pending',
                //     order_number VARCHAR(50),
                //     created_at TIMESTAMPTZ DEFAULT NOW(),
                //     customer_name TEXT,
                //     customer_email TEXT,
                //     customer_phone TEXT,
                //     billing_line1 TEXT,
                //     billing_line2 TEXT,
                //     billing_city TEXT,
                //     billing_postal_code TEXT,
                //     billing_country TEXT,
                //     shipping_line1 TEXT,
                //     shipping_line2 TEXT,
                //     shipping_city TEXT,
                //     shipping_postal_code TEXT,
                //     shipping_country TEXT,
                //     FOREIGN KEY (user_id) REFERENCES users(id)
                // );
            // `

            // `
                // CREATE TABLE IF NOT EXISTS order_items (
                //     id SERIAL PRIMARY KEY,
                //     order_id INTEGER NOT NULL,
                //     product_id INTEGER NOT NULL,
                //     quantity INTEGER NOT NULL,
                //     FOREIGN KEY (order_id) REFERENCES orders(id),
                //     FOREIGN KEY (product_id) REFERENCES products(id)
                // );
            // `

            // `
            //     CREATE TABLE password_reset_tokens (
            //         id SERIAL PRIMARY KEY,
            //         user_id INTEGER REFERENCES users(id),
            //         token_hash TEXT NOT NULL,
            //         expires_at TIMESTAMPTZ NOT NULL,
            //         used BOOLEAN DEFAULT FALSE
            //     );
            // `

        );

        console.log("Table successfully created")
    } catch (err) {
        console.log("Unable to create table", err);
    } 
}

createTable();