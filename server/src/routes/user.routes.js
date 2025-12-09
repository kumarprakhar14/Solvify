import express from "express";
import { createInquiry } from "../controllers/inquiry.controller.js";
import { getUserProfile, updateUserProfile } from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";

const router = express.Router();

router.post("/inquiry", createInquiry);
router.get("/profile", requireAuth, getUserProfile);
router.put("/profile", requireAuth, updateUserProfile);

export { router };