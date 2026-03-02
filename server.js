import express from "express";
import cors from "cors";
import { productsRouter } from "./routes/products.js";
import { authRouter } from "./routes/auth.js";
import { cartRouter } from "./routes/cart.js";
import { requireAuth } from "./middleware/requireAuth.js";
import session from "express-session";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 8000;
const secret = process.env.SPIRAL_SECRET_SESSION || "peanut-butter-jellytime"

//Middleware START
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    }
}))

app.use("/api/products", productsRouter);
app.use("/api/auth", authRouter);
app.use("/api/cart", requireAuth, cartRouter)

app.use((req, res) => res.status(400).json({ error: "Invalid endpoint" }));
//Middleware END

app.listen(PORT, () => {
    console.log("Listening on Port " + PORT);
}).on("error", (err) => {
    console.log("Failed to start server:", err);
});