// import sqlite3 from "sqlite3";
// import { open } from "sqlite";
// import path from "node:path";

// export const getDBConnection = async () => {
//     return open({
//         filename: path.join("database.db"),
//         driver: sqlite3.Database
//     });
// }

import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    // ssl: {
    //     rejectUnauthorized: false, 
    // },
    // connectionTimeoutMillis: 30000,
});