import { pool } from "../db/db.js";
import { Resend } from "resend";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import validator from "validator";

dotenv.config();

const resend = new Resend(process.env.RESEND_SECRET_KEY);
const baseUrl = process.env.NODE_ENV === "production"
                    ? process.env.CLIENT_URL
                    : "http://localhost:8000"

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

export const requestResetPassword = async (req, res) => {
    const { email } = req.body;

    if (!email || email.trim() === "" || !validator.isEmail(email)) {
        console.error("Incorrect email format");
        return res.status(400).json({ error: "Please enter a valid email address" });
    }

    try {
        const user = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        const userId = user.rows[0].id;

        const token = crypto.randomBytes(32).toString("hex");
        const tokenHash = crypto.createHash("sha256").update(token).digest("hex");
        const expiresAt = new Date(Date.now() + 1000 * 60 * 15) // 15 minutes

        await pool.query(
            `
                INSERT INTO password_reset_tokens(user_id, token_hash, expires_at)
                VALUES ($1,$2,$3)
            `, [userId, tokenHash, expiresAt]
        );

        const resetLink = `${baseUrl}/reset-password.html?token=${token}`;

        try {
            await resend.emails.send({
                from: "Spiral Sounds <no-reply@spiralsounds.shop>",
                to: email,
                subject: "Reset your password",
                html: 
                    `
                        <p>You requested a password reset.</p>
                        <p><a href="${resetLink}">Click here to reset your password</a></p>
                        <p>This link expires in 15 minutes.</p>
                    `
            })
        } catch (err) {
            console.error("Failed to send email:", err);
            return res.status(500).json({ error: "Failed to send email. Please try again." });    
        }

        res.status(200).json({ message: "If an account exists, a reset link has been sent."});

    } catch (err) {
        console.error({ error: "Failed to request password change", details: err });
        res.status(500).json({ error: "Failed to request password change", details: err });
    }
}

export const resetPassword = async (req, res) => {
    const { token, password, confirmPassword } = req.body;
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
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const tokenResult = await pool.query(
            `
                SELECT * FROM password_reset_tokens
                WHERE token_hash = $1
                AND expires_at > NOW()
                AND used = false
            `, [hashedToken]
        )

        if (tokenResult.rows.length === 0) {
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [tokenResult.rows[0].user_id])

        if (userResult.rows.length === 0) {
            console.error("User not found");
            return res.status(404).json({ error: "User not found" });
        }

        const userId = userResult.rows[0].id;
        const tokenId = tokenResult.rows[0].id;

        const hashedPassword = await bcrypt.hash(password, 10);

        const isSamePassword = await bcrypt.compare(password, userResult.rows[0].password);
        if (isSamePassword) {
            console.error("New password matched current password");
            return res.status(400).json({ error: "Your new password cannot be the same as your current password. Please choose a different password." });
        }

        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, userId]);

        await pool.query('UPDATE password_reset_tokens SET used = true WHERE id = $1', [tokenId]);

        console.log(`Password successfully update for user ID : ${userId}`);
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