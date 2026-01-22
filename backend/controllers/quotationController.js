const Quotation = require("../models/Quotation");

// helper for quotation number
const generateQuotationNo = async () => {
  const last = await Quotation.findOne().sort({ createdAt: -1 });
  if (!last) return "EST-1";

  const lastNo = Number(last.quotationNo.split("-")[1]);
  return `EST-${lastNo + 1}`;
};

// CREATE
exports.createQuotation = async (req, res) => {
  try {
    const quotationNo = await generateQuotationNo();

    const { items = [], discount = 0, extraCharges = [] } = req.body;

    // Subtotal
    const subTotal = items.reduce(
      (sum, i) => sum + Number(i.quantity) * Number(i.price),
      0,
    );

    // Charges
    const chargesTotal = extraCharges.reduce((sum, c) => {
      const tax = (Number(c.amount) * Number(c.taxRate || 0)) / 100;
      return sum + Number(c.amount) + tax;
    }, 0);

    const totalAmount = Math.max(subTotal + chargesTotal - discount, 0);

    const quotation = new Quotation({
      ...req.body,
      quotationNo,
      subTotal,
      totalAmount,
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
    const limit = Number(req.query.limit) || 20;

    const quotations = await Quotation.find()
      .populate("customer", "name phone")
      .sort({ createdAt: -1 })
      .limit(limit);

    res.json(quotations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET SINGLE
exports.getQuotationById = async (req, res) => {
  try {
    const quotation = await Quotation.findById(req.params.id).populate(
      "customer bank signature",
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
    const { items = [], discount = 0, extraCharges = [] } = req.body;

    const subTotal = items.reduce(
      (sum, i) => sum + Number(i.quantity) * Number(i.price),
      0,
    );

    const chargesTotal = extraCharges.reduce((sum, c) => {
      const tax = (Number(c.amount) * Number(c.taxRate || 0)) / 100;
      return sum + Number(c.amount) + tax;
    }, 0);

    const totalAmount = Math.max(subTotal + chargesTotal - discount, 0);

    const quotation = await Quotation.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        subTotal,
        totalAmount,
      },
      { new: true },
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

// GET /quotations/next-number
exports.getNextQuotationNumber = async (req, res) => {
  const last = await Quotation.findOne().sort({ createdAt: -1 });

  let number = 1;
  if (last?.quotationNo) {
    number = Number(last.quotationNo.split("-")[1]) + 1;
  }

  res.json({
    prefix: "EST",
    number,
    quotationNo: `EST-${number}`,
    date: new Date().toISOString().slice(0, 10),
  });
};
