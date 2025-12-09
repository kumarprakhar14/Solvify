export const requireAdmin = (req, res, next) => {
    // Assuming req.user is populated by previous auth middleware (e.g., passport or requireAuth)
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Forbidden: Admin access required" });
    }

    next();
};
