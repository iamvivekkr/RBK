const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const customerRoutes = require("./routes/customerRoutes");
const companyRoutes = require("./routes/companyRoutes");
const signatureRoutes = require("./routes/signatureRoutes");
const bankRoutes = require("./routes/bankRoutes");
const productRoutes = require("./routes/productRoutes");
const quotationRoutes = require("./routes/quotationRoutes");

dotenv.config();
connectDB();

const app = express();

/* ---------- Middleware ---------- */
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ---------- Routes ---------- */
app.use("/api/customers", customerRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/signatures", signatureRoutes);
app.use("/api/banks", bankRoutes);
app.use("/api/products", productRoutes);
app.use("/api/quotations", quotationRoutes);

app.get("/", (req, res) => {
  res.send("RBK Quotation API Running");
});

/* ---------- Server ---------- */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
