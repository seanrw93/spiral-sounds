import express from "express";
import { createOrder, getOrder, getOrderHistory } from "../controllers/ordersController.js";

export const ordersRouter = express.Router();

ordersRouter.post("/", createOrder);
ordersRouter.get("/history", getOrderHistory);
ordersRouter.get("/:orderid", getOrder);
