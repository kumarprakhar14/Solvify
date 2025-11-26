import User from "../models/user.model.js";
import { hashify, verifyHash } from "../utils/crypto.js";
import { generateAcessToken, generateRefreshToken, verifyRefreshToken } from "../services/auth.service.js";
import mongoose from "mongoose";

// @desc Register new user
// @route POST /api/auth/register
export const register = async (req, res) => {
    try {
        const { name, email, phone, company, password } = req.body;

        //check if user exists -> checking for unique email as well as unique username
        const existingUser = await User.findOne({
            $or: [{ email }, { name }]
        });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" })
        }

        // create user (password gets hashed by pre-save hook)
        const user = new User({ name, email, phone, company, password });
        await user.save();

        return res.status(201).json({
            message: "User registerd successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error("Register error", err);
        res.status(500).json({ message: "Server error" })
    }
};


// @desc Login user
// @route POST /api/auth/login
export const login = async (req, res) => {
    try {
        const { name, password } = req.body;

        // find user -> allow flexible login with username as well as with email
        const user = await User.findOne({
            $or: [{ name }, { email: name }]
        }).select('+password');

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // verify password
        const isMatch = await verifyHash(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate tokens
        const accessToken = generateAcessToken(user._id);
        const refeshToken = generateRefreshToken(user._id);

        // Hash the refresh token before saving
        const hashedRefreshToken = await hashify(refeshToken);

        // we will implement hashing logic for refresh token
        user.refreshTokens.push(hashedRefreshToken);
        await user.save();

        // Send plain refresh token as HttpOnly Cookie, not the hashed one
        res.cookie("refreshToken", refeshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,  // 7 days in miliseconds
        });

        // Set authorization header
        res.set({ 'authorization': `Bearer ${accessToken}` });
        console.log(user);
        return res.status(200).json({
            message: "Login successful",
            accessToken,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.error("Login error", err);
        res.status(500).json({ message: "Server error" });

    }
}

// @desc Logout User
// @route /api/auth/logout
export const logout = async (req, res, next) => {
    try {
        res.removeHeader('Authorization');
        return res.status(200).json({ message: "Logout Successful" });
    } catch (err) {
        console.error("Logout Error", err);
        res.status(500).json({ message: "Server Error" });
    }
}


// @desc get a new access token
// @route /api/auth/refresh
export const refreshToken = async (req, res, next) => {
    try {
        // read refresh token from cookie
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(403).json({ message: "Refresh token missing" });
        }

        // verify refresh token
        const payload = verifyRefreshToken(refreshToken);
        const userObj = await User.findById(payload.id)


        // issue new access token
        const newAccessToken = generateAcessToken({ userId: payload.id });

        if (!newAccessToken) {
            console.log("Couldn't not generate new access token");
        }

        // Set authorization header
        res.set({ 'authorization': `Bearer ${newAccessToken}` });

        return res.status(200).json({
            newAccessToken,
            message: "New access token issued",
            user: userObj
        });
    } catch (err) {
        next(err);
    }
}