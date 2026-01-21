import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function ProductList({ onAdd, onEdit }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const res = await API.get("/products");
    setProducts(res.data);
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;

    await API.delete(`/products/${id}`);
    loadProducts(); // refresh list
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <ArrowLeft onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />
        <h3>Search</h3>
      </div>

      <input
        style={styles.search}
        placeholder="Search Product"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoFocus
      />

      {filtered.map((p) => (
        <div key={p._id} style={styles.card}>
          <div style={styles.icon}>🛍️</div>

          <div style={{ flex: 1 }}>
            <div style={styles.name}>{p.name}</div>
            <div style={styles.sub}>₹{p.sellingPrice}</div>
          </div>

          <div style={styles.actions}>
            <button style={styles.editBtn} onClick={() => onEdit(p)}>
              Edit
            </button>

            <button
              style={styles.deleteBtn}
              onClick={() => handleDelete(p._id)}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      <button style={styles.addBtn} onClick={onAdd}>
        + Add Product
      </button>
    </div>
  );
}
const styles = {
  page: {
    minHeight: "100vh",
    background: "#0e0e0e",
    color: "#fff",
    paddingBottom: 80,
  },
  header: { display: "flex", gap: 12, padding: 16, background: "#2a2a2a" },
  search: {
    margin: 16,
    padding: 14,
    width: "calc(100% - 32px)",
    borderRadius: 12,
    border: "1px solid #444",
    background: "#2a2a2a",
    color: "#fff",
  },
  card: {
    margin: 16,
    padding: 16,
    background: "#1c1c1c",
    borderRadius: 14,
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  icon: { fontSize: 28 },
  name: { fontSize: 16 },
  sub: { opacity: 0.7 },
  qty: { opacity: 0.7 },
  addBtn: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 18,
    background: "#5b7cfa",
    border: "none",
    color: "#fff",
    fontSize: 18,
    cursor: "pointer",
  },
  actions: {
    display: "flex",
    gap: 8,
  },

  editBtn: {
    padding: "6px 10px",
    borderRadius: 6,
    border: "none",
    background: "#4caf50",
    color: "#fff",
    cursor: "pointer",
  },

  deleteBtn: {
    padding: "6px 10px",
    borderRadius: 6,
    border: "none",
    background: "#f44336",
    color: "#fff",
    cursor: "pointer",
  },
};
