import express from "express";
import { createCheckoutSession } from "../controllers/checkoutController.js";

export const checkoutRouter = express.Router();

checkoutRouter.post('/session', createCheckoutSession);