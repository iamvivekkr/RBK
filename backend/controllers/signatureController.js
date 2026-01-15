const Signature = require("../models/Signature");

// Create Signature
exports.createSignature = async (req, res) => {
  try {
    const { name, isDefault } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Signature image required" });
    }

    // If default = true → unset previous defaults
    if (isDefault === "true") {
      await Signature.updateMany({}, { isDefault: false });
    }

    const signature = new Signature({
      name,
      isDefault,
      image: `/uploads/signatures/${req.file.filename}`,
    });

    await signature.save();
    res.status(201).json(signature);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Get all Signatures
exports.getSignatures = async (req, res) => {
  try {
    const signatures = await Signature.find().sort({ createdAt: -1 });
    res.json(signatures);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update Signature
exports.updateSignature = async (req, res) => {
  try {
    const { name, isDefault } = req.body;

    if (isDefault === "true") {
      await Signature.updateMany({}, { isDefault: false });
    }

    const updateData = { name, isDefault };

    if (req.file) {
      updateData.image = `/uploads/signatures/${req.file.filename}`;
    }

    const signature = await Signature.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!signature)
      return res.status(404).json({ message: "Signature not found" });

    res.json(signature);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete Signature
exports.deleteSignature = async (req, res) => {
  try {
    const signature = await Signature.findByIdAndDelete(req.params.id);

    if (!signature)
      return res.status(404).json({ message: "Signature not found" });

    res.json({ message: "Signature deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
