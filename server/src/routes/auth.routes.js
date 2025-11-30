import express from "express";
import { login, logout, refreshToken, register, forgotPassword } from "../controllers/auth.controller.js";

const router = express.Router();

// Auth endpoints
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.post("/forgot-password", forgotPassword);

export { router };