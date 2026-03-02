import { getDBConnection } from "../db/db.js";

export const viewAllProducts = async () => {
    const db = await getDBConnection();

    try {
        // const products = await db.all(`SELECT * FROM products`);
        // const displayItems = products.map(({ artist, title, year, genre, stock }) => {
        //     return { artist, title, year, genre, stock }
        // }) 
        // console.table(displayItems);

        // const users = await db.all(`SELECT * FROM users`);

        const cartItems = await db.all('SELECT * FROM cart_items')

        console.table(cartItems)
    } catch (err) {
        console.log("Unable to log table", err)
    } finally {
        await db.close();
    }
}

viewAllProducts();