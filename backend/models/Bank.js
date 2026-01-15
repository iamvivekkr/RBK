const mongoose = require("mongoose");

const bankSchema = new mongoose.Schema(
  {
    ifsc: String,
    bankName: String,
    accountNumber: String,
    branch: String,
    upi: String,
    openingBalance: Number,
    gpay: String,
    notes: String,
    isDefault: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bank", bankSchema);
