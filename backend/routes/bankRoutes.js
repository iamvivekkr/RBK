const express = require("express");
const router = express.Router();
const controller = require("../controllers/bankController");

router.post("/", controller.createBank);
router.get("/", controller.getBanks);
router.put("/:id", controller.updateBank);
router.delete("/:id", controller.deleteBank);

module.exports = router;
