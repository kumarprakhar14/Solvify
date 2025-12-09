import { Router } from "express";
import { router as authRoutes } from "./auth.routes.js";
import { router as userRoutes } from "./user.routes.js";
import { router as quotationRoutes } from "./quotation.routes.js";
import { router as adminRoutes } from "./admin.routes.js";

const router = Router();

// Test route 
router.get("/", (req, res) => {
    res.json({ message: "Welcome to the API 🚀" });
});

// Public routes
router.use("/auth", authRoutes);

// Protected routes
router.use("/user", userRoutes);
router.use("/quotations", quotationRoutes);
router.use("/admin", adminRoutes);

export { router };