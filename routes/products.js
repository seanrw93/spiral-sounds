import express from "express";
import { getProducts, getGenres } from "../controllers/productController.js"

export const productsRouter = express.Router();

productsRouter.get("/", getProducts);
productsRouter.get("/genres", getGenres);

