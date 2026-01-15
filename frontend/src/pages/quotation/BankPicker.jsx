import { useEffect, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import API from "../../services/api";

export default function BankPicker({ selectedBank, onDone }) {
  const [banks, setBanks] = useState([]);

  /* ---------------- LOAD BANKS ---------------- */
  useEffect(() => {
    loadBanks();
  }, []);

  const loadBanks = async () => {
    const res = await API.get("/banks");
    setBanks(res.data || []);
  };

  const isSelected = (bank) => {
    if (!selectedBank) return false;
    if (selectedBank.type === "CASH" && bank.type === "CASH") return true;
    return selectedBank._id === bank._id;
  };

  /* ---------------- UI ---------------- */
  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <ArrowLeft onClick={() => onDone(null)} style={{ cursor: "pointer" }} />
        <h3>Select Bank</h3>
      </div>

      {/* CASH OPTION */}
      <div
        style={{
          ...styles.card,
          border: isSelected({ type: "CASH" })
            ? "1px solid #5b7cfa"
            : "1px solid transparent",
        }}
        onClick={() => onDone({ type: "CASH", label: "Cash" })}
      >
        <div>
          <div style={styles.name}>Cash</div>
          <div style={styles.sub}>No bank details</div>
        </div>
        {isSelected({ type: "CASH" }) && <Check />}
      </div>

      {/* BANK LIST */}
      {banks.map((b) => (
        <div
          key={b._id}
          style={{
            ...styles.card,
            border: isSelected(b)
              ? "1px solid #5b7cfa"
              : "1px solid transparent",
          }}
          onClick={() => onDone(b)}
        >
          <div>
            <div style={styles.name}>{b.bankName}</div>
            <div style={styles.sub}>A/C ••••{b.accountNumber?.slice(-4)}</div>
            {b.isDefault && <div style={styles.default}>Default</div>}
          </div>

          {isSelected(b) && <Check />}
        </div>
      ))}

      {banks.length === 0 && <div style={styles.empty}>No banks added</div>}
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
    margin: "10px 12px",
    padding: 14,
    background: "#1c1c1c",
    borderRadius: 12,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
  },
  name: {
    fontSize: 16,
    marginBottom: 4,
  },
  sub: {
    fontSize: 13,
    opacity: 0.7,
  },
  default: {
    marginTop: 4,
    fontSize: 12,
    color: "#4caf50",
  },
  empty: {
    textAlign: "center",
    padding: 40,
    opacity: 0.6,
  },
};
