const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },

    sellingPrice: { type: Number },
    sellingTaxType: {
      type: String,
      enum: ["with", "without"],
      default: "without",
    },

    taxRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    purchasePrice: { type: Number },
    purchaseTaxType: {
      type: String,
      enum: ["with", "without"],
      default: "with",
    },

    hsn: { type: String },
    unit: { type: String, default: "PCS" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", productSchema);
