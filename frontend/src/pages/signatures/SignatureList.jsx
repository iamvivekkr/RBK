// src/pages/signatures/SignatureList.jsx
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
const API_URL = import.meta.env.VITE_API_URL;

export default function SignatureList({ onAdd, onEdit }) {
  const [signatures, setSignatures] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadSignatures();
  }, []);

  const loadSignatures = async () => {
    const res = await API.get("/signatures");
    setSignatures(res.data);
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <ArrowLeft onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />
        <h3>Signature</h3>
      </div>

      {/* Signature Cards */}
      {signatures.map((sig) => (
        <div key={sig._id} style={styles.card}>
          <img
            src={`${API_URL}${sig.image}`}
            alt="signature"
            style={styles.image}
          />

          <div style={{ flex: 1 }}>
            <div style={styles.name}>{sig.name}</div>
            <div style={styles.edit} onClick={() => onEdit(sig)}>
              View or Edit →
            </div>
          </div>

          {sig.isDefault && <span style={styles.badge}>Default</span>}
        </div>
      ))}

      {/* Add Button */}
      <button style={styles.addBtn} onClick={onAdd}>
        + Add New Signature
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
  header: {
    display: "flex",
    gap: 12,
    padding: 16,
    alignItems: "center",
    background: "#2a2a2a",
  },
  card: {
    margin: 16,
    padding: 16,
    background: "#1c1c1c",
    borderRadius: 14,
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  image: {
    width: 80,
    height: 50,
    objectFit: "contain",
    background: "#fff",
    borderRadius: 6,
  },
  name: { fontSize: 16, marginBottom: 6 },
  edit: { color: "#5b7cfa", cursor: "pointer" },
  badge: {
    background: "#5b7cfa",
    padding: "4px 8px",
    borderRadius: 6,
    fontSize: 12,
  },
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
    cursor: "pointer",
  },
};
