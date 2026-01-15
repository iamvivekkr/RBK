const express = require("express");
const Company = require("../models/Company");
const upload = require("../middleware/upload");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const company = await Company.findOneAndUpdate({}, req.body, {
      upsert: true,
      new: true,
    });
    res.json(company);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  const company = await Company.findOne();
  res.json(company);
});

router.post("/upload-logo", upload.single("logo"), async (req, res) => {
  const company = await Company.findOneAndUpdate(
    {},
    { logo: `/uploads/logos/${req.file.filename}` },
    { upsert: true, new: true }
  );
  res.json(company);
});

module.exports = router;
