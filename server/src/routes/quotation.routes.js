import { Router } from "express";
import { 
    generateQuotation, 
    createQuotation, 
    getQuotations, 
    getQuotationById, 
    updateQuotation 
} from "../controllers/quotation.controller.js";
import { requireAuth } from "../middlewares/requireAuth.js";
import { requireAdmin } from "../middlewares/roleAuth.js";

const router = Router();

// Public or Client routes
router.post("/generate", requireAuth, generateQuotation); // Clients can generate drafts
router.get("/:id", requireAuth, getQuotationById); // Clients can view their quotations (logic in controller needs to check ownership)

// Admin routes
router.post("/", requireAuth, requireAdmin, createQuotation); // Only admin can finalize/save
router.get("/", requireAuth, requireAdmin, getQuotations); // Only admin can list all
router.put("/:id", requireAuth, requireAdmin, updateQuotation); // Only admin can update

export { router };
