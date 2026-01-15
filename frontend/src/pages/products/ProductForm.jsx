import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import API from "../../services/api";

const TAX_RATES = [0, 5, 12, 18, 28];

export default function ProductForm({ product, onBack }) {
  const [form, setForm] = useState({
    name: "",
    sellingPrice: "",
    sellingTaxType: "without",
    taxRate: 0,
    purchasePrice: "",
    purchaseTaxType: "with",
    hsn: "",
    unit: "PCS",
  });

  useEffect(() => {
    if (product) setForm(product);
  }, [product]);

  const submit = async () => {
    if (!form.name || !form.sellingPrice) {
      alert("Product name and selling price required");
      return;
    }

    if (product?._id) {
      await API.put(`/products/${product._id}`, form);
    } else {
      await API.post("/products", form);
    }

    onBack();
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <ArrowLeft onClick={onBack} style={{ cursor: "pointer" }} />
        <h3>Add Product</h3>
      </div>

      <div style={styles.card}>
        {input("Product Name", "name")}

        {priceRow("Selling price", "sellingPrice", "sellingTaxType")}

        {select("Tax rate %", "taxRate", TAX_RATES)}

        {priceRow("Purchase Price", "purchasePrice", "purchaseTaxType")}

        {input("HSN Code", "hsn")}
        {input("Unit", "unit")}
      </div>

      <button style={styles.submitBtn} onClick={submit}>
        Add Product
      </button>
    </div>
  );

  function input(label, key) {
    return (
      <>
        <label style={styles.label}>{label}</label>
        <input
          style={styles.input}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      </>
    );
  }

  function select(label, key, options) {
    return (
      <>
        <label style={styles.label}>{label}</label>
        <select
          style={styles.input}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })}
        >
          {options.map((o) => (
            <option key={o} value={o}>
              {o}%
            </option>
          ))}
        </select>
      </>
    );
  }

  function priceRow(label, priceKey, typeKey) {
    return (
      <>
        <label style={styles.label}>{label}</label>
        <div style={styles.row}>
          <input
            style={{ ...styles.input, flex: 1 }}
            value={form[priceKey]}
            onChange={(e) => setForm({ ...form, [priceKey]: e.target.value })}
          />
          <select
            style={styles.taxType}
            value={form[typeKey]}
            onChange={(e) => setForm({ ...form, [typeKey]: e.target.value })}
          >
            <option value="without">Without Tax</option>
            <option value="with">With Tax</option>
          </select>
        </div>
      </>
    );
  }
}
const styles = {
  page: {
    minHeight: "100vh",
    background: "#0e0e0e",
    color: "#fff",
    paddingBottom: 100,
  },
  header: { display: "flex", gap: 12, padding: 16, background: "#2a2a2a" },
  card: { background: "#1c1c1c", margin: 16, padding: 16, borderRadius: 16 },
  label: { marginTop: 12, marginBottom: 6, display: "block", opacity: 0.8 },
  input: {
    width: "100%",
    padding: 14,
    borderRadius: 10,
    border: "1px solid #444",
    background: "#2a2a2a",
    color: "#fff",
  },
  row: { display: "flex", gap: 8 },
  taxType: {
    padding: 14,
    borderRadius: 10,
    background: "#2a2a2a",
    border: "1px solid #444",
    color: "#fff",
  },
  submitBtn: {
    position: "fixed",
    bottom: 16,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 14,
    background: "#5b7cfa",
    border: "none",
    color: "#fff",
    fontSize: 16,
    cursor: "pointer",
  },
};
