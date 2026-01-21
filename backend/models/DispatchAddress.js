const mongoose = require("mongoose");

const dispatchAddressSchema = new mongoose.Schema(
  {
    addressLine1: { type: String, required: true },
    addressLine2: String,
    pincode: { type: String, required: true },
    city: String,
    state: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("DispatchAddress", dispatchAddressSchema);
