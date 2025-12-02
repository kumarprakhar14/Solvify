import express from "express";
import { login, logout, refreshToken, register, forgotPassword, resetPassword, validateResetToken } from "../controllers/auth.controller.js";
import passport from "passport";

const router = express.Router();

// Auth endpoints
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh", refreshToken);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

router.get('/validate-reset-token/:token', validateResetToken);

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
    res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173'); // Redirect to frontend after login
});

export { router };