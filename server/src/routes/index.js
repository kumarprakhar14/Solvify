import { Router } from "express";
import { router as productRoutes } from "./products.routes.js";
import { router as authRoutes } from "./auth.routes.js"
import { requireAuth } from "../middlewares/requireAuth.js";

const router = Router();

// Test route 
router.get("/", (req, res) => {
    res.json({ message: "Welcome to the API 🚀" });
});

// Public routes
// Mount auth routes
router.use("/auth", authRoutes);

// Protected rotues
// Mount product routes
router.use("/products", requireAuth, productRoutes);

export { router };