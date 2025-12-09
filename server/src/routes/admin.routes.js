import { Router } from "express";
import { inviteAdmin } from "../controllers/admin.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireAdmin } from "../middlewares/roleAuth.js";

const router = Router();

// Protect all admin routes
router.use(requireAuth, requireAdmin);

router.post("/invite", inviteAdmin);

export { router };
