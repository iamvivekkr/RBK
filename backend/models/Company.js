const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  line1: String,
  line2: String,
  pincode: String,
  city: String,
  state: String,
});

const companySchema = new mongoose.Schema(
  {
    name: String,
    gst: String,
    phone: String,
    email: String,
    tradeName: String,
    logo: String,
    pan: String,
    alternatePhone: String,
    website: String,
    billingAddress: addressSchema,
    shippingAddress: addressSchema,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", companySchema);
