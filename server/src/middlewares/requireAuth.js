// This middleware ensures the request has a valid user attached.

export const requireAuth = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" })
    }
    next();
};