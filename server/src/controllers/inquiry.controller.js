import User from "../models/user.model.js";
import Inquiry from "../models/inquiry.model.js";
import { inngest } from "../inngest/index.js";

// @desc Create new inquiry
// @route POST /api/inquiry
export const createInquiry = async (req, res) => {
    // console.log(req.body);

    try {
        const { name, email, phone, company, service, projectTitle, description, budget, timeline  } = req.body;

        // Check if user exists (link account if registered)
        const user = await User.findOne({ email });

        // Create inquiry document
        const inquiry = new Inquiry({
            userId: user ? user._id : undefined,
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
                inquiryId: inquiry._id,
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