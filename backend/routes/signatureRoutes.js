const express = require("express");
const router = express.Router();
const controller = require("../controllers/signatureController");
const upload = require("../middleware/uploadSignature");

// Create signature
router.post("/", upload.single("image"), controller.createSignature);

// Get all signatures
router.get("/", controller.getSignatures);

// Update signature
router.put("/:id", upload.single("image"), controller.updateSignature);

// Delete signature
router.delete("/:id", controller.deleteSignature);

module.exports = router;
