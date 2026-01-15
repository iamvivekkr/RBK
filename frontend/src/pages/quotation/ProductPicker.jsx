import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import API from "../../services/api";

export default function ProductPicker({ selectedItems = [], onDone }) {
  const [products, setProducts] = useState([]);
  const [items, setItems] = useState([]);

  /* ---------------- LOAD PRODUCTS ---------------- */
  useEffect(() => {
    loadProducts();
    setItems(selectedItems.map((p) => ({ ...p })));
  }, []);

  const loadProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data || []);
  };

  /* ---------------- HELPERS ---------------- */

  const getQty = (productId) =>
    items.find((i) => i._id === productId)?.qty || 0;

  const updateQty = (product) => {
    const exists = items.find((i) => i._id === product._id);

    if (exists) {
      setItems(
        items.map((i) => (i._id === product._id ? { ...i, qty: i.qty + 1 } : i))
      );
    } else {
      setItems([
        ...items,
        {
          ...product,
          qty: 1,
          price: product.sellingPrice || 0,
        },
      ]);
    }
  };

  const decreaseQty = (product) => {
    const exists = items.find((i) => i._id === product._id);
    if (!exists) return;

    if (exists.qty === 1) {
      setItems(items.filter((i) => i._id !== product._id));
    } else {
      setItems(
        items.map((i) => (i._id === product._id ? { ...i, qty: i.qty - 1 } : i))
      );
    }
  };

  /* ---------------- UI ---------------- */

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <ArrowLeft onClick={() => onDone(null)} style={{ cursor: "pointer" }} />
        <h3>Select Products</h3>
      </div>

      {/* PRODUCT LIST */}
      <div style={{ paddingBottom: 100 }}>
        {products.map((p) => {
          const qty = getQty(p._id);

          return (
            <div key={p._id} style={styles.card}>
              <div style={{ flex: 1 }}>
                <div style={styles.name}>{p.name}</div>
                <div style={styles.sub}>
                  ₹ {p.sellingPrice} / {p.unit || "Unit"}
                </div>
              </div>

              {qty === 0 ? (
                <button style={styles.addBtn} onClick={() => updateQty(p)}>
                  Add
                </button>
              ) : (
                <div style={styles.counter}>
                  <Minus onClick={() => decreaseQty(p)} />
                  <span>{qty}</span>
                  <Plus onClick={() => updateQty(p)} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CONTINUE */}
      <button style={styles.continueBtn} onClick={() => onDone(items)}>
        Continue
      </button>
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0e0e0e",
    color: "#fff",
  },
  header: {
    display: "flex",
    gap: 12,
    padding: 16,
    background: "#2a2a2a",
    alignItems: "center",
  },
  card: {
    margin: 12,
    padding: 14,
    background: "#1c1c1c",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  name: {
    fontSize: 16,
  },
  sub: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 4,
  },
  addBtn: {
    padding: "6px 14px",
    borderRadius: 8,
    background: "#5b7cfa",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },
  counter: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    background: "#2a2a2a",
    padding: "6px 10px",
    borderRadius: 10,
  },
  continueBtn: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 18,
    background: "#4caf50",
    border: "none",
    color: "#fff",
    fontSize: 18,
    cursor: "pointer",
  },
};
