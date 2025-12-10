// The function accepts an access token and returns the user object
import User from "../models/user.model.js"
import { verifyAccessToken } from "./auth.service.js"

export const getUser = async (accessToken) => {
    try {
        const decoded = verifyAccessToken(accessToken);
        const user = await User.findById({ _id: decoded.id })

        return user;
        // even if the user is not found, user object will be null
        // this will be handled by the controller
    } catch (error) {
        return null;
    }
}