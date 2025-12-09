import User from "../models/user.model.js";
import Inquiry from "../models/inquiry.model.js";
import { inngest } from "../inngest/index.js";

// @desc Create new inquiry
// @route POST /api/inquiry
export const createInquiry = async (req, res) => {
    try {
        const { name, email, phone, company, service, projectTitle, description, budget, timeline  } = req.body;

        // 1. OPTIONAL: Check if user exists, but DO NOT BLOCK if they don't
        const user = await User.findOne({ email });
        
        // 2. Create inquiry document
        const inquiry = new Inquiry({
            userId: user ? user._id : null, // Link if user exists, else null
            name, 
            email,
            phone,
            company,
            service,
            projectTitle,
            description,
            budget,
            timeline
        });

        await inquiry.save();

        // 3. Fire inngest event
        // This hands off the "heavy lifting" (AI generation) to the background
        await inngest.send({
            name: "inquiry/submit",
            data: {
                inquiryId: inquiry._id, // Send ID, fetch fresh data in function
                inquiryData: req.body   // Or send raw data
            },
        });

        return res.status(201).json({
            message: "Inquiry received. Quotation generation started.",
            inquiry
        });

    } catch (error) {
        console.error("Create Inquiry error: ", error);
        return res.status(500).json({ message: "Server error" });
    }
}