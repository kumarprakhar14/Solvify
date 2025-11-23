import { Router } from "express";

const router = Router();

// Example GET /api/products
router.get("/", (req, res) => {
    res.json([
        { id: 1, name: "Mango Juice", price: 10 },
        { id: 2, name: "Litchi Juice", price: 12 } 
    ]);
});

// Example GET /api/products/:id
router.get("/:id", (req, res) => {
    const { id } = req.params;
    res.json({ id, name: "Sample Product", price: 99 });
});

export { router }