import express from 'express';
import { forgotPassword, getProfile, login, register, resetPassword, verifyEmail } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.get("/me", protect, getProfile);
authRouter.post("/verify-email", verifyEmail);
authRouter.post("/forgot-password", forgotPassword);
authRouter.post("/reset-password/:token", resetPassword);

export default authRouter;