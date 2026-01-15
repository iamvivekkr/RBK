import { ArrowLeft, Plus, Trash } from "lucide-react";
import { useState } from "react";

const TAX_RATES = [0, 5, 12, 18, 28];

export default function ChargesModal({ charges = [], onDone }) {
  const [list, setList] = useState(
    charges.length ? charges : [{ label: "", amount: "", taxRate: 0 }]
  );

  const update = (i, key, value) => {
    const copy = [...list];
    copy[i][key] = value;
    setList(copy);
  };

  const addRow = () =>
    setList([...list, { label: "", amount: "", taxRate: 0 }]);

  const removeRow = (i) => setList(list.filter((_, idx) => idx !== i));

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <ArrowLeft onClick={() => onDone(null)} />
        <h3>Add Charges</h3>
      </div>

      {/* LIST */}
      {list.map((c, i) => (
        <div key={i} style={styles.card}>
          <input
            placeholder="Charge name"
            value={c.label}
            onChange={(e) => update(i, "label", e.target.value)}
            style={styles.input}
          />

          <input
            placeholder="Amount"
            type="number"
            value={c.amount}
            onChange={(e) => update(i, "amount", e.target.value)}
            style={styles.input}
          />

          <select
            value={c.taxRate}
            onChange={(e) => update(i, "taxRate", Number(e.target.value))}
            style={styles.input}
          >
            {TAX_RATES.map((t) => (
              <option key={t} value={t}>
                Tax {t}%
              </option>
            ))}
          </select>

          <Trash
            size={18}
            style={{ cursor: "pointer", color: "#ff4d4f" }}
            onClick={() => removeRow(i)}
          />
        </div>
      ))}

      <div style={styles.addMore} onClick={addRow}>
        <Plus size={16} /> Add Charge
      </div>

      <button
        style={styles.saveBtn}
        onClick={() =>
          onDone(list.filter((c) => c.label && Number(c.amount) > 0))
        }
      >
        Save Charges
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
    paddingBottom: 90,
  },
  header: {
    display: "flex",
    gap: 12,
    padding: 16,
    background: "#2a2a2a",
    alignItems: "center",
  },
  card: {
    background: "#1c1c1c",
    margin: 12,
    padding: 12,
    borderRadius: 12,
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr auto",
    gap: 8,
    alignItems: "center",
  },
  input: {
    background: "#2a2a2a",
    border: "1px solid #444",
    borderRadius: 8,
    padding: 10,
    color: "#fff",
  },
  addMore: {
    margin: 16,
    color: "#5b7cfa",
    display: "flex",
    gap: 6,
    cursor: "pointer",
  },
  saveBtn: {
    position: "fixed",
    bottom: 16,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 14,
    background: "#55b6a2",
    border: "none",
    color: "#fff",
    fontSize: 16,
    cursor: "pointer",
  },
};
