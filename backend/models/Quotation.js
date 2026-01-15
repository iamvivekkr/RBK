const mongoose = require("mongoose");

const quotationItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
  name: String,
  hsn: String,
  unit: String,
  quantity: Number,
  price: Number,
  taxRate: Number,
  total: Number,
});

const chargeSchema = new mongoose.Schema({
  label: String,
  amount: Number,
  taxRate: Number,
});

const quotationSchema = new mongoose.Schema(
  {
    quotationNo: { type: String, unique: true },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    items: [quotationItemSchema],

    subTotal: Number,

    discount: {
      type: Number,
      default: 0,
    },

    extraCharges: [chargeSchema], // delivery, packaging

    totalAmount: Number,

    dispatchAddress: Object,
    shippingAddress: Object,

    bank: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bank",
    },

    signature: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Signature",
    },

    reference: String,
    notes: String,
    terms: String,

    attachments: [String],

    status: {
      type: String,
      enum: ["DRAFT", "CREATED"],
      default: "DRAFT",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Quotation", quotationSchema);
