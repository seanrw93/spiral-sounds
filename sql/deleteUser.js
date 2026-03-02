import { getDBConnection } from "../db/db.js";

export const deleteUser = async (...usernames) => {
    const db = await getDBConnection();

    try {
        for (const username of usernames) {
            await db.run('DELETE FROM users WHERE username = ?', [username]);
        }
        console.log(`Deleted ${usernames.length} users`)
    } catch (err) {
        console.log("Unable to delete user", err);
    } finally {
        await db.close();
    }
}

deleteUser();