import express from "express";
import { logInUser, logOutUser, registerUser, requestResetPassword, resetPassword } from "../controllers/authController.js";
import { getCurrentUser, getAccount } from "../controllers/meController.js"
import { requireAuth } from "../middleware/requireAuth.js";

export const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", logInUser);
authRouter.post("/request-reset-password", requestResetPassword);
authRouter.post("/reset-password", resetPassword);

authRouter.get("/logout", logOutUser);
authRouter.get("/me", getCurrentUser);
authRouter.get("/account", requireAuth, getAccount);
