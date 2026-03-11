import express from "express";
import { handleStripeWebhook } from "../controllers/webhookController.js";

export const webhookRouter = express.Router();

webhookRouter.post(
    "/webhook", 
    express.raw({ type: "application/json" }), 
    handleStripeWebhook
);