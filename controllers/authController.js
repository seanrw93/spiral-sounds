import validator from "validator";
import { pool } from "../db/db.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
    const userCredentials = Object.entries(req.body);
    const usernameRegex = /^[a-zA-Z0-9_-]{1,20}$/
    
    for (const [key, value] of userCredentials) {

        //Ensure all fields filled
        if (value === null || value.trim() === "") {
            return res.status(400).json({ error: "All fields required" })
        }

        //Ensure no whitespace
        req.body[key] = value?.trim();
    }

    // Extract trimmed values
    let { name, username, email, password } = req.body;

    if (!usernameRegex.test(username)) {
        return res.status(400).json({ error: "Username must be 1–20 characters, using letters, numbers, _ or -" });
    }

    if (!validator.isEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
    }

    try {
        const hashed = await bcrypt.hash(password, 10);

        //Check for duplicate username or email
        const query = `SELECT username, email FROM users`;
        const uniqueCredentials = await pool.query(query);

        for (const row of uniqueCredentials.rows) {
            if (row.username.toLowerCase() === username.toLowerCase()) {
                return res.status(400).json({ error: "Username already exists"})
            }

            if (row.email.toLowerCase() === email.toLowerCase()) {
                return res.status(400).json({ error: "Email already exists"})
            }
        }
        
        const insertQuery = `INSERT INTO users(name, email, username, password) VALUES ($1,$2,$3,$4)`;
        const result = await pool.query(insertQuery, [name, email, username, hashed]);

        req.session.userId = result.rows[0];

        res.status(201).json({ message: "User registered successfully"});
    } catch (err) {
        res.status(400).json({ error: "Registration failed", details: err})
    }
}

export const logInUser = async (req, res) => {
    const userCredentials = Object.entries(req.body);
    const { username, password } = req.body;
    
    for (const [key, value] of userCredentials) {

        //Ensure all fields filled
        if (value === null || value.trim() === "") {
            return res.status(400).json({ error: "All fields required" })
        }

        //Ensure no whitespace
        req.body[key] = value?.trim();
    }

    try {
        const query = 'SELECT * FROM users WHERE username = $1';
        const result = await pool.query(query, [username]);

        const user = result.rows[0];

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (result.rows.length === 0) { return res.status(400).json({ error: "Invalid credentials" }); }

        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid credentials", details: err})
        }

        req.session.userId = user.id;
        res.status(200).json({ message: "Logged in" })

    } catch (err) {
        console.error('Login error:', err.details)
        res.status(500).json({ error: 'Login failed. Please try again.' })  
    }
}

export const logOutUser = async (req, res) => {
    // Check if the user is logged in
    if (!req.session.userId) {
        return res.status(400).json({ error: 'User is not logged in' });
    }

    req.session.destroy((err) => {
        if (err) {
            console.log('Error destroying session:', err);
            return res.status(500).json({ error: 'Logout failed' });
        }

        res.status(200).json({ message: 'Logged out successfully' });
    });
};