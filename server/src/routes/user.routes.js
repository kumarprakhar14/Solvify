import express from "express";
import { createInquiry } from "../controllers/inquiry.controller.js";

const router = express.Router();

router.post("/inquiry", createInquiry);

export { router };