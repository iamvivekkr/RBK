const Bank = require("../models/Bank");

exports.createBank = async (req, res) => {
  if (req.body.isDefault) {
    await Bank.updateMany({}, { isDefault: false });
  }
  const bank = new Bank(req.body);
  await bank.save();
  res.status(201).json(bank);
};

exports.getBanks = async (req, res) => {
  const banks = await Bank.find().sort({ createdAt: -1 });
  res.json(banks);
};

exports.updateBank = async (req, res) => {
  if (req.body.isDefault) {
    await Bank.updateMany({}, { isDefault: false });
  }
  const bank = await Bank.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(bank);
};

exports.deleteBank = async (req, res) => {
  await Bank.findByIdAndDelete(req.params.id);
  res.json({ message: "Bank deleted" });
};
