import validator from "validator";
import { getDBConnection } from "../db/db.js";
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

    const db = await getDBConnection();

    try {
        const hashed = await bcrypt.hash(password, 10);

        //Check for duplicate username or email
        const query = `SELECT username, email FROM users`;
        const uniqueCredentials = await db.all(query);

        for (const row of uniqueCredentials) {
            if (row.username.toLowerCase() === username.toLowerCase()) {
                return res.status(400).json({ error: "Username already exists"})
            }

            if (row.email.toLowerCase() === email.toLowerCase()) {
                return res.status(400).json({ error: "Email already exists"})
            }
        }
        
        const insertQuery = `INSERT INTO users(name, email, username, password) VALUES (?,?,?,?)`;
        const result = await db.run(insertQuery, [name, email, username, hashed]);

        req.session.userId = result.lastID;

        res.status(201).json({ message: "User registered successfully"});
    } catch (err) {
        res.status(400).json({ error: "Registration failed", details: err})
    } finally {
        await db.close();
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

    const db = await getDBConnection();

    try {
        const query = 'SELECT * FROM users WHERE username = ?';
        const user = await db.get(query, [username]);
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid credentials", details: err})
        }

        req.session.userId = user.id;
        res.status(200).json({ message: "Logged in" })

    } catch (err) {
        console.error('Login error:', err.details)
        res.status(500).json({ error: 'Login failed. Please try again.' })  
    } finally {
        await db.close();
    }
}

export const logOutUser = async (req, res) => {
    // Check if the user is logged in
    if (!req.session.userId) {
        return res.status(400).json({ error: 'User is not logged in' });
    }

    req.session.destroy((err) => {
        if (err) {
            console.console.log();
            ('Error destroying session:', err);
            return res.status(500).json({ error: 'Logout failed' });
        }

        res.status(200).json({ message: 'Logged out successfully' });
    });
};