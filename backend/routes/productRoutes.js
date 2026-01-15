const express = require("express");
const router = express.Router();
const controller = require("../controllers/productController");

// Create product
router.post("/", controller.createProduct);

// Get all products
router.get("/", controller.getProducts);

// Get product by id (optional)
router.get("/:id", controller.getProductById);

// Update product
router.put("/:id", controller.updateProduct);

// Delete product
router.delete("/:id", controller.deleteProduct);

module.exports = router;
