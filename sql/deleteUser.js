import { pool } from "../db/db.js";

export const deleteUser = async (...usernames) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN')

        for (const username of usernames) {
            await client.query('DELETE FROM users WHERE username = $1', [username]);
        }
        console.log(`Deleted ${usernames.length} user${usernames.length === 1 ? "" : "s"}`);

        await client.query('COMMIT')
    } catch (err) {
        await client.query('ROLLBACK');
        console.log("Unable to delete user", err);
    } finally {
        await client.release();
    }
}

deleteUser(
    //Add username(s)
    //'user1', 'user2', 'user3'
);