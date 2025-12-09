import Quotation from "../models/quotation.model.js";
import Inquiry from "../models/inquiry.model.js";
import { generateQuotationContent } from "../services/ai.service.js";
import { inngest } from "../inngest/index.js";

// Generate a quotation draft using AI
export const generateQuotation = async (req, res) => {
    try {
        const { inquiryId, manualDetails } = req.body;
        
        let details = manualDetails;

        if (inquiryId) {
            const inquiry = await Inquiry.findById(inquiryId);
            if (!inquiry) {
                return res.status(404).json({ message: "Inquiry not found" });
            }
            // Merge inquiry details
            details = {
                ...manualDetails,
                name: inquiry.name,
                email: inquiry.email,
                phone: inquiry.phone,
                company: inquiry.company,
                service: inquiry.service,
                projectTitle: inquiry.projectTitle,
                description: inquiry.description,
                budget: inquiry.budget,
                timeline: inquiry.timeline
            };
        }

        if (!details) {
            return res.status(400).json({ message: "Please provide inquiry ID or manual details" });
        }

        const aiResponse = await generateQuotationContent(details);
        
        // Return the generated content without saving, so admin can review/edit
        res.status(200).json({
            success: true,
            data: aiResponse
        });

    } catch (error) {
        console.error("Generate Quotation Error:", error);
        res.status(500).json({ message: error.message || "Failed to generate quotation" });
    }
};

// Create/Save a quotation (after review)
export const createQuotation = async (req, res) => {
    try {
        const quotationData = req.body;
        
        const quotation = new Quotation(quotationData);
        await quotation.save();

        // If linked to an inquiry, update the inquiry status
        if (quotation.inquiryId) {
            await Inquiry.findByIdAndUpdate(quotation.inquiryId, { 
                status: 'quotation_sent',
                quotationId: quotation._id
            });
        }

        res.status(201).json({
            success: true,
            data: quotation
        });
    } catch (error) {
        console.error("Create Quotation Error:", error);
        res.status(500).json({ message: "Failed to create quotation" });
    }
};

// Get all quotations
export const getQuotations = async (req, res) => {
    try {
        const quotations = await Quotation.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: quotations });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch quotations" });
    }
};

// Get single quotation
export const getQuotationById = async (req, res) => {
    try {
        const quotation = await Quotation.findById(req.params.id).populate('inquiryId');
        if (!quotation) {
            return res.status(404).json({ message: "Quotation not found" });
        }
        res.status(200).json({ success: true, data: quotation });
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch quotation" });
    }
};



// Update quotation
export const updateQuotation = async (req, res) => {
    try {
        const quotation = await Quotation.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        
        if (!quotation) {
            return res.status(404).json({ message: "Quotation not found" });
        }

        // Check if status was updated to 'approved'
        if (req.body.status === 'approved') {
            await inngest.send({
                name: "quotation/approved",
                data: {
                    quotationId: quotation._id,
                    quotationData: quotation
                }
            });
        }

        res.status(200).json({ success: true, data: quotation });
    } catch (error) {
        res.status(500).json({ message: "Failed to update quotation" });
    }
};
