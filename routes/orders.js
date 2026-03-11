import express from "express";
import { createOrder, getOrder } from "../controllers/ordersController.js";

export const ordersRouter = express.Router();

//Create new order
ordersRouter.post("/", createOrder);

//Get specific order details
ordersRouter.get("/:orderid", getOrder);
