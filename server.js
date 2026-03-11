import express from "express";
import cors from "cors";
import { healthRouter } from "./routes/health.js";
import { productsRouter } from "./routes/products.js";
import { authRouter } from "./routes/auth.js";
import { cartRouter } from "./routes/cart.js";
import { ordersRouter } from "./routes/orders.js";
import { checkoutRouter } from "./routes/checkout.js";
import { webhookRouter } from "./routes/webhook.js";
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
  origin: process.env.NODE_ENV === "production" ? ['https://srw-spiral-sounds.netlify.app'] :  true, 
  credentials: true
}));

app.use(express.static("public"));

app.use((req, res, next) => {
  if (req.originalUrl === "/api/stripe/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use("/api/stripe", webhookRouter);

process.env.NODE_ENV === "production" && app.set("trust proxy", 1)

app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false, 
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax" 
    }
}));

app.use("/api/health", healthRouter);
app.use("/api/products", productsRouter);
app.use("/api/auth", authRouter);
app.use("/api/cart", requireAuth, cartRouter);
app.use("/api/orders", requireAuth, ordersRouter);
app.use("/api/checkout", requireAuth, checkoutRouter);

app.use((req, res) => res.status(400).json({ error: "Invalid endpoint" }));
//Middleware END

app.listen(PORT, () => {
    console.log("Listening on Port " + PORT);
}).on("error", (err) => {
    console.log("Failed to start server:", err);
});