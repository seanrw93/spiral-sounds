import cron from 'node-cron';
import { pool } from '../db/db.js';

cron.schedule("0 3 * * *", async () => {
    try {
        const result = await pool.query(
            `DELETE FROM password_reset_tokens
             WHERE expires_at < NOW() OR used = true`
        );

        console.log(`Cron cleanup: ${result.rowCount} tokens removed`)
    } catch (err) {
        console.error("Cron cleanup error:", err);
    }
})