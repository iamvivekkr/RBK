import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function DispatchAddressList({ onAdd, onEdit }) {
  const [addresses, setAddresses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    const res = await API.get("/dispatch-addresses");
    setAddresses(res.data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    await API.delete(`/dispatch-addresses/${id}`);
    loadAddresses();
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <ArrowLeft onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />
        <h3>Dispatch Addresses</h3>
      </div>

      {addresses.map((a) => (
        <div key={a._id} style={styles.card}>
          <div style={{ flex: 1 }}>
            <div style={styles.line}>{a.addressLine1}</div>
            <div style={styles.sub}>
              {a.city}, {a.state} – {a.pincode}
            </div>

            <div style={styles.actions}>
              <span style={styles.edit} onClick={() => onEdit(a)}>
                Edit →
              </span>
              <span style={styles.delete} onClick={() => handleDelete(a._id)}>
                Delete
              </span>
            </div>
          </div>
        </div>
      ))}

      <button style={styles.addBtn} onClick={onAdd}>
        + Add Address
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
  card: { margin: 16, padding: 16, background: "#1c1c1c", borderRadius: 14 },
  line: { fontSize: 15 },
  sub: { fontSize: 13, opacity: 0.7, marginTop: 4 },
  actions: { display: "flex", gap: 14, marginTop: 8 },
  edit: { color: "#5b7cfa", cursor: "pointer" },
  delete: { color: "#f44336", cursor: "pointer" },
  addBtn: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 18,
    background: "#4caf50",
    border: "none",
    color: "#fff",
    fontSize: 18,
    cursor: "pointer", // ✅ ADD THIS
  },
};
