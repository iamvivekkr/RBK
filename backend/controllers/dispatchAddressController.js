const DispatchAddress = require("../models/DispatchAddress");

// ✅ Create Dispatch Address
exports.createAddress = async (req, res) => {
  try {
    const address = new DispatchAddress(req.body);
    await address.save();
    res.status(201).json(address);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Get All Dispatch Addresses
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await DispatchAddress.find().sort({ createdAt: -1 });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ Update Dispatch Address
exports.updateAddress = async (req, res) => {
  try {
    const address = await DispatchAddress.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );

    if (!address) return res.status(404).json({ message: "Address not found" });

    res.json(address);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ✅ Delete Dispatch Address
exports.deleteAddress = async (req, res) => {
  try {
    const address = await DispatchAddress.findByIdAndDelete(req.params.id);

    if (!address) return res.status(404).json({ message: "Address not found" });

    res.json({ message: "Dispatch address deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
