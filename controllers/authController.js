import validator from "validator";
import { pool } from "../db/db.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
    const userCredentials = Object.entries(req.body);
    const usernameRegex = /^[a-zA-Z0-9_-]{1,20}$/
    
    for (const [key, value] of userCredentials) {

        //Ensure all fields filled
        if (value === null || value.trim() === "") {
            console.error("All fields required");
            return res.status(400).json({ error: "All fields required" })
        }

        //Ensure no whitespace
        req.body[key] = value?.trim();
    }

    // Extract trimmed values
    let { name, username, email, password } = req.body;

    if (!usernameRegex.test(username)) {
        console.error("Username must be 1–20 characters, using letters, numbers, _ or -");
        return res.status(400).json({ error: "Username must be 1–20 characters, using letters, numbers, _ or -" });
    }

    if (!validator.isEmail(email)) {
        console.error("Invalid email format");
        return res.status(400).json({ error: "Invalid email format" });
    }

    try {
        const hashed = await bcrypt.hash(password, 10);

        //Check for duplicate username or email
        const query = `SELECT username, email FROM users`;
        const uniqueCredentials = await pool.query(query);

        for (const row of uniqueCredentials.rows) {
            if (row.username.toLowerCase() === username.toLowerCase()) {
                console.error("Username already exists");
                return res.status(400).json({ error: "Username already exists"})
            }

            if (row.email.toLowerCase() === email.toLowerCase()) {
                console.error("Email already exists");
                return res.status(400).json({ error: "Email already exists"})
            }
        }
        
        const insertQuery = 
            `
                INSERT INTO users(name, email, username, password) 
                VALUES ($1,$2,$3,$4) 
                RETURNING id
            `;
        const result = await pool.query(insertQuery, [name, email, username, hashed]);

        req.session.userId = result.rows[0].id;

        res.status(201).json({ message: "User registered successfully"});
    } catch (err) {
        console.error({ error: "Registration failed", details: err})
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

export const resetPassword = async (req, res) => {
    const { username, password, confirmPassword } = req.body;
    const userCredentials = Object.entries(req.body);

    for (const [key, value] of userCredentials) {

        //Ensure all fields filled
        if (value === null || value.trim() === "") {
            return res.status(400).json({ error: "All fields required" })
        }

        //Ensure no whitespace
        req.body[key] = value?.trim();
    }

    if (password !== confirmPassword) {
        console.log({ error: "Passwords do not match" });
        return res.status(400).json({ error: "Passwords do not match" })
    }

    try {
        const hashed = await bcrypt.hash(password, 10);
        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (user.rows.length === 0) {
            console.error("User not found");
            return res.status(404).json({ error: "User not found" });
        }

        if (username.toLowerCase() !== user.rows[0].username.toLowerCase()) {
            console.error("Incorrect username");
            return res.status(400).json({ error: "Incorrect username" })
        }

        const isSamePassword = await bcrypt.compare(password, user.rows[0].password);
        if (isSamePassword) {
            console.error("New password matchrd current password");
            return res.status(400).json({ error: "Your new password cannot be the same as your current password. Please choose a different password." });
        }

        await pool.query('UPDATE users SET password = $1 WHERE username = $2', [hashed, username]);

        console.log(`Password successfully update for user : ${username}`);
        res.status(200).json({ message: "Password successfully updated" });

    } catch (err) {
        console.error("Error updating password:", err);
        res.status(500).json({ error: "Failed to update password. Please try again.", details: err });
    }
}

export const logOutUser = async (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('Error destroying session:', err);
            return res.status(500).json({ error: 'Logout failed' });
        }

        res.status(200).json({ message: 'Logged out successfully' });
    });
};