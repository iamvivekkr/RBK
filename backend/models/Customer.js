const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  line1: String,
  line2: String,
  pincode: String,
  city: String,
  state: String,
});

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: String,
    companyName: String, // optional
    gst: String, // optional
    billingAddress: addressSchema,
    shippingAddress: addressSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
