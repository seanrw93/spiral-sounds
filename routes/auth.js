import express from "express";
import { logInUser, logOutUser, registerUser } from "../controllers/authController.js";
import { getCurrentUser } from "../controllers/meController.js"

export const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", logInUser);
authRouter.get("/logout", logOutUser);

authRouter.get("/me", getCurrentUser);
