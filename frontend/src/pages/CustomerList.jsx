// src/pages/customers/CustomerList.jsx
import { ArrowLeft, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function CustomerList({ onAdd, onEdit }) {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const res = await API.get("/customers");
    setCustomers(res.data);
  };

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search),
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?"))
      return;

    await API.delete(`/customers/${id}`);
    loadCustomers();
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <ArrowLeft style={{ cursor: "pointer" }} onClick={() => navigate(-1)} />
        <h3>Customers</h3>
      </div>

      {/* Search */}
      <input
        style={styles.search}
        placeholder="Search by name or mobile"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        autoFocus
      />

      {/* Add Button */}
      <div style={styles.addBtn} onClick={onAdd}>
        <Plus size={18} />
        <span>Add new customer</span>
      </div>

      {/* Customer List */}
      {filteredCustomers.map((c) => (
        <div key={c._id} style={styles.item} onClick={() => onEdit(c)}>
          <div style={styles.avatar}>{c.name.charAt(0).toUpperCase()}</div>

          <div style={{ flex: 1 }}>
            <div style={styles.name}>{c.name}</div>
            <div style={styles.phone}>{c.phone}</div>
          </div>

          <span
            style={styles.delete}
            onClick={(e) => {
              e.stopPropagation(); // prevents edit click
              handleDelete(c._id);
            }}
          >
            Delete
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const styles = {
  page: { minHeight: "100vh", background: "#0e0e0e", color: "#fff" },
  header: {
    display: "flex",
    gap: 12,
    padding: 16,
    alignItems: "center",
    background: "#2a2a2a",
  },

  search: {
    width: "calc(100% - 32px)",
    margin: 16,
    padding: 14,
    borderRadius: 10,
    background: "#1c1c1c",
    border: "none",
    color: "#fff",
  },
  addBtn: {
    margin: "0 16px 16px",
    padding: 14,
    background: "#3a3a3a",
    borderRadius: 12,
    display: "flex",
    gap: 8,
    alignItems: "center",
    cursor: "pointer",
  },
  item: {
    display: "flex",
    gap: 12,
    padding: 16,
    borderBottom: "1px solid #333",
    cursor: "pointer",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: "50%",
    background: "#ffb6c1",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
  },
  name: { fontSize: 16 },
  phone: { fontSize: 13, opacity: 0.7 },
  delete: {
    color: "#f44336",
    fontSize: 14,
    cursor: "pointer",
  },
};
