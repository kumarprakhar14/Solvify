import User from "../models/user.model.js";
import Inquiry from "../models/inquiry.model.js";
import { inngest } from "../inngest/index.js";

// @desc Create new inquiry
// @route POST /api/inquiry
export const createInquiry = async (req, res) => {
    // console.log(req.body);

    try {
        const { name, email, phone, company, service, projectTitle, description, budget, timeline  } = req.body;

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
            service,
            projectTitle,
            description,
            budget,
            timeline
        });

        await inquiry.save();

        // Fire inngest event
        await inngest.send({
            name: "inquiry/submit",
            data: {
                inquiry,
            },
        });

        return res.status(201).json({
            message: "Inquiry created successfully",
            inquiry
        })

    } catch (error) {
        console.error("Create Inquiry error: ", error);
        return res.status(500).json({ message: "Server error"})
    }
}