import express from "express";
import cors from "cors";
import { productsRouter } from "./routes/products.js";
import { authRouter } from "./routes/auth.js";
import { cartRouter } from "./routes/cart.js";
import { requireAuth } from "./middleware/requireAuth.js";
import session from "express-session";
import dotenv from "dotenv";
import crypto from "crypto";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;
const secret = process.env.SPIRAL_SECRET_SESSION || crypto.randomBytes(64).toString("hex");

//Middleware START
app.use(cors({
  origin: ['https://srw-spiral-sounds.netlify.app'], 
  credentials: true
}));

app.use(express.static("public"));
app.use(express.json());

app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production", 
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" 
    }
}));

app.use("/api/products", productsRouter);
app.use("/api/auth", authRouter);
app.use("/api/cart", requireAuth, cartRouter);

app.use((req, res) => res.status(400).json({ error: "Invalid endpoint" }));
//Middleware END

app.listen(PORT, () => {
    console.log("Listening on Port " + PORT);
}).on("error", (err) => {
    console.log("Failed to start server:", err);
});