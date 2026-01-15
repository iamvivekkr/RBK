const express = require("express");
const router = express.Router();
const controller = require("../controllers/customerController");

// Create a customer
router.post("/", controller.createCustomer);

// Get all customers
router.get("/", controller.getCustomers);

// Update a customer by ID
router.put("/:id", controller.updateCustomer);

// Delete a customer by ID
router.delete("/:id", controller.deleteCustomer);

module.exports = router;
