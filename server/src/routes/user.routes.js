import express from "express";
import { createInquiry } from "../controllers/inquiry.controller.js";
import { getUserProfile, updateUserProfile } from "../controllers/user.controller.js";
import { deserializeUser } from "../middlewares/deserializeuser.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.post("/inquiry", createInquiry);

// User profile routes
router.get("/profile", deserializeUser, requireAuth, getUserProfile);
router.put("/profile", deserializeUser, requireAuth, updateUserProfile);

export { router };