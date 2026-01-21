// src/pages/banks/BankList.jsx
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

export default function BankList({ onAdd, onEdit }) {
  const [banks, setBanks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadBanks();
  }, []);

  const loadBanks = async () => {
    const res = await API.get("/banks");
    setBanks(res.data);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bank account?"))
      return;

    await API.delete(`/banks/${id}`);
    loadBanks();
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <ArrowLeft onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />
        <h3>Bank Accounts</h3>
      </div>

      {banks.map((bank) => (
        <div key={bank._id} style={styles.card}>
          <div style={styles.icon}>🏦</div>

          <div style={{ flex: 1 }}>
            <div style={styles.name}>{bank.bankName}</div>
            <div style={styles.sub}>{bank.accountNumber}</div>

            <div style={styles.actions}>
              <span style={styles.edit} onClick={() => onEdit(bank)}>
                View or Edit →
              </span>

              <span
                style={styles.delete}
                onClick={() => handleDelete(bank._id)}
              >
                Delete
              </span>
            </div>
          </div>

          {bank.isDefault && <span style={styles.badge}>Default</span>}
        </div>
      ))}

      <button style={styles.addBtn} onClick={onAdd}>
        + Add New Bank
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
  card: {
    margin: 16,
    padding: 16,
    background: "#1c1c1c",
    borderRadius: 14,
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  icon: { fontSize: 32 },
  name: { fontSize: 16 },
  sub: { fontSize: 13, opacity: 0.6 },
  edit: { color: "#5b7cfa", cursor: "pointer" },
  badge: { background: "#5b7cfa", padding: "4px 8px", borderRadius: 6 },
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
  actions: {
    display: "flex",
    gap: 14,
    marginTop: 6,
  },

  delete: {
    color: "#f44336",
    cursor: "pointer",
  },
};
