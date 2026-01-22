const express = require("express");
const router = express.Router();
const controller = require("../controllers/quotationController");

router.get("/next-number", controller.getNextQuotationNumber);
router.post("/", controller.createQuotation);
router.get("/", controller.getQuotations);
router.get("/:id", controller.getQuotationById);
router.put("/:id", controller.updateQuotation);
router.delete("/:id", controller.deleteQuotation);

module.exports = router;
