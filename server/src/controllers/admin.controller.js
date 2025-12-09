import User from "../models/user.model.js";

// Invite/Add another admin
export const inviteAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(400).json({ message: "User with this email already exists" });
        }

        const newAdmin = new User({
            name,
            email,
            password,
            role: 'admin'
        });

        await newAdmin.save();

        res.status(201).json({
            success: true,
            message: "Admin added successfully",
            data: {
                id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email,
                role: newAdmin.role
            }
        });

    } catch (error) {
        console.error("Invite Admin Error:", error);
        res.status(500).json({ message: "Failed to add admin" });
    }
};
