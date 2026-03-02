import express from "express";
import { getAll, addToCart, deleteAll, deleteItem, getCartCount } from "../controllers/cartController.js"

export const cartRouter = express.Router();

cartRouter.get("/", getAll);
cartRouter.get("/cart-count", getCartCount);

cartRouter.post("/add", addToCart);

cartRouter.delete("/all", deleteAll);
cartRouter.delete("/:itemId", deleteItem);


