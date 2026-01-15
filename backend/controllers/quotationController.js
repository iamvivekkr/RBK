const Quotation = require("../models/Quotation");

// helper for quotation number
const generateQuotationNo = async () => {
  const count = await Quotation.countDocuments();
  return `EST-${count + 1}`;
};

// CREATE
exports.createQuotation = async (req, res) => {
  try {
    const quotationNo = await generateQuotationNo();

    const quotation = new Quotation({
      ...req.body,
      quotationNo,
      status: "CREATED",
    });

    await quotation.save();
    res.status(201).json(quotation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET ALL
exports.getQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.find()
      .populate("customer")
      .sort({ createdAt: -1 });

    res.json(quotations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE
exports.getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id).populate(
      "customer bank signature"
    );

    if (!quotation)
      return res.status(404).json({ message: "Quotation not found" });

    res.json(quotation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateQuotation = async (req, res) => {
  try {
    const quotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!quotation)
      return res.status(404).json({ message: "Quotation not found" });

    res.json(quotation);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE
exports.deleteQuotation = async (req, res) => {
  try {
    await Quotation.findByIdAndDelete(req.params.id);
    res.json({ message: "Quotation deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
