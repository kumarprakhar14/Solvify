import jwt from "jsonwebtoken";
import { verifyAccessToken } from "../services/auth.service.js";
import User from "../models/user.model.js";

// This middleware verifies the JWT and attaches the user payload to req.user
// This middleware does not force login
// If user is logged in, it simply attaces the user to the payload
// It will run for all the routes.
// For, the protected routes, we will apply another middleware -> 
// requireAuth() which will force the user to login

export const deserializeUser = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return next(); // no token, just move on (public route can still work)
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ message: "Not authorized, no token" })
        }

        const decoded = verifyAccessToken(token);

        req.user = await User.findOne({ _id: decoded.id });  // Attach decoded payload (userId, email, etc.)
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
