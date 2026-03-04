import express from "express";
import { getHealth } from "../controllers/healthController.js";

export const healthRouter = express.Router();

healthRouter.get("/", getHealth);