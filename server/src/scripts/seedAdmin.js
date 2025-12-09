import mongoose from "mongoose";
import { config } from "../config/env.js";
import User from "../models/user.model.js";

const seedAdmin = async () => {
    try {
        await mongoose.connect(config.mongoUri);
        console.log("Connected to MongoDB");

        const adminEmail = "Abhishek@solvify.com";
        const adminPassword = "123@solvify";

        const existingAdmin = await User.findOne({ email: adminEmail.toLowerCase() });

        if (existingAdmin) {
            console.log("Admin account already exists.");
            if (existingAdmin.role !== 'admin') {
                existingAdmin.role = 'admin';
                await existingAdmin.save();
                console.log("Updated existing user to admin role.");
            }
        } else {
            const newAdmin = new User({
                name: "Admin",
                email: adminEmail,
                password: adminPassword,
                role: "admin"
            });
            await newAdmin.save();
            console.log("Admin account created successfully.");
        }

        process.exit(0);
    } catch (error) {
        console.error("Error seeding admin:", error);
        process.exit(1);
    }
};

seedAdmin();
