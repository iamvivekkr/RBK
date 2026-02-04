import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import API from "../../services/api";

const BASE_TAX_RATES = [0, 5, 12, 18, 28];
const UNIT_OPTIONS = [
  // Count
  "PCS",
  "NOS",
  "UNIT",
  "SET",
  "PAIR",
  "BOX",
  "PACK",
  "DOZEN",

  // Weight
  "KG",
  "GM",
  "MG",
  "TON",

  // Volume
  "LTR",
  "ML",
  "KL",

  // Length
  "MTR",
  "CM",
  "MM",
  "INCH",
  "FT",

  // Area
  "SQFT",
  "SQM",
  "SQCM",

  // Time / Service
  "HOUR",
  "DAY",
  "MONTH",
  "YEAR",

  // Others
  "BUNDLE",
  "ROLL",
  "BAG",
  "CAN",
  "BOTTLE",
  "SERVICE",
];

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
    if (product) {
      setForm(product);

      if (
        typeof product.taxRate === "number" &&
        !BASE_TAX_RATES.includes(product.taxRate)
      ) {
        setTaxOptions(
          [...BASE_TAX_RATES, product.taxRate].sort((a, b) => a - b),
        );
      } else {
        setTaxOptions(BASE_TAX_RATES);
      }
    }
  }, [product]);

  const submit = async () => {
    if (form.taxRate < 0 || form.taxRate > 100) {
      alert("Tax rate must be between 0 and 100%");
      return;
    }

    if (product?._id) {
      await API.put(`/products/${product._id}`, form);
    } else {
      await API.post("/products", form);
    }

    onBack();
  };

  const [taxOptions, setTaxOptions] = useState(BASE_TAX_RATES);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customTax, setCustomTax] = useState("");

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <ArrowLeft onClick={onBack} style={{ cursor: "pointer" }} />
        <h3>{product ? "Edit Product" : "Add Product"}</h3>
      </div>

      <div style={styles.card}>
        {input("Product Name", "name")}

        {priceRow("Selling price", "sellingPrice", "sellingTaxType")}

        {select("Tax rate %", "taxRate")}

        {priceRow("Purchase Price", "purchasePrice", "purchaseTaxType")}

        {input("HSN Code", "hsn")}
        {unitSelect("Unit", "unit")}
      </div>

      <button style={styles.submitBtn} onClick={submit}>
        {product ? "Update Product" : "Add Product"}
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

  function unitSelect(label, key) {
    return (
      <>
        <label style={styles.label}>{label}</label>
        <select
          style={styles.input}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        >
          {UNIT_OPTIONS.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </>
    );
  }

  function select(label, key) {
    return (
      <>
        <label style={styles.label}>{label}</label>

        <select
          style={styles.input}
          value={form[key]}
          onChange={(e) => {
            if (e.target.value === "custom") {
              setShowCustomInput(true);
              setCustomTax("");
            } else {
              setForm({ ...form, [key]: Number(e.target.value) });
            }
          }}
        >
          {taxOptions.map((o) => (
            <option key={o} value={o}>
              {o}%
            </option>
          ))}

          <option value="custom">Custom %</option>
        </select>

        {showCustomInput && (
          <input
            autoFocus
            type="number"
            min={0}
            max={100}
            placeholder="Enter tax %"
            style={{ ...styles.input, marginTop: 8 }}
            value={customTax}
            onChange={(e) => setCustomTax(e.target.value)}
            onBlur={applyCustomTax}
            onKeyDown={(e) => {
              if (e.key === "Enter") applyCustomTax();
            }}
          />
        )}
      </>
    );

    function applyCustomTax() {
      const val = Number(customTax);
      if (isNaN(val) || val < 0 || val > 100) {
        setShowCustomInput(false);
        return;
      }

      // add temporarily if not exists
      if (!taxOptions.includes(val)) {
        setTaxOptions([...taxOptions, val].sort((a, b) => a - b));
      }

      setForm({ ...form, [key]: val });
      setShowCustomInput(false);
    }
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
