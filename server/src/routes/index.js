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

// Mount auth routes
router.use("/auth", authRoutes);

// Mount user routes
router.use("/user", userRoutes);
router.use("/users", userRoutes);

// Mount quotation routes (supports /quotations as expected by frontend and /quotation)
router.use("/quotations", quotationRoutes);
router.use("/quotation", quotationRoutes);

// Mount admin routes
router.use("/admin", adminRoutes);

export { router };