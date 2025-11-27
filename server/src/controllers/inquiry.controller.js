import User from "../models/user.model.js";
import Inquiry from "../models/inquiry.model.js";

// @desc Create new inquiry
// @route POST /api/inquiry
export const createInquiry = async (req, res) => {
    try {
        const { name, email, phone, company, serviceType, projectTitle, projectDescription: description, budgetRange: budget, expectedTimeline: timeline  } = req.body;

        // Check if user exists 
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Create inquiry document
        const inquiry = new Inquiry({
            userId: user._id,
            name, 
            email,
            phone,
            company,
            serviceType,
            projectTitle,
            projectDescription,
            budget,
            timeline
        });

        await inquiry.save();

        return res.status(201).json({
            message: "Inquiry created successfully",
            inquiry
        })
        
    } catch (error) {
        console.error("Create Inquiry error: ", error);
        return res.status(500).json({ message: "Server error"})
    }
}