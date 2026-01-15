import { useEffect, useState } from "react";
import { ArrowLeft, Check } from "lucide-react";
import API from "../../services/api";

export default function SignaturePicker({ selectedSignature, onDone }) {
  const [signatures, setSignatures] = useState([]);

  /* ---------------- LOAD SIGNATURES ---------------- */
  useEffect(() => {
    loadSignatures();
  }, []);

  const loadSignatures = async () => {
    const res = await API.get("/signatures");
    setSignatures(res.data || []);
  };

  const isSelected = (sig) => {
    if (!selectedSignature) return false;
    if (selectedSignature === "NONE" && sig === "NONE") return true;
    return selectedSignature?._id === sig._id;
  };

  /* ---------------- UI ---------------- */
  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <ArrowLeft onClick={() => onDone(null)} style={{ cursor: "pointer" }} />
        <h3>Select Signature</h3>
      </div>

      {/* NONE OPTION */}
      <div
        style={{
          ...styles.card,
          border: isSelected("NONE")
            ? "1px solid #5b7cfa"
            : "1px solid transparent",
        }}
        onClick={() => onDone("NONE")}
      >
        <div>
          <div style={styles.name}>None</div>
          <div style={styles.sub}>No signature on quotation</div>
        </div>
        {isSelected("NONE") && <Check />}
      </div>

      {/* SIGNATURE LIST */}
      {signatures.map((sig) => (
        <div
          key={sig._id}
          style={{
            ...styles.card,
            border: isSelected(sig)
              ? "1px solid #5b7cfa"
              : "1px solid transparent",
          }}
          onClick={() => onDone(sig)}
        >
          <div style={styles.left}>
            <img src={sig.image} alt="signature" style={styles.image} />
            <div>
              <div style={styles.name}>{sig.name}</div>
              {sig.isDefault && <div style={styles.default}>Default</div>}
            </div>
          </div>

          {isSelected(sig) && <Check />}
        </div>
      ))}

      {signatures.length === 0 && (
        <div style={styles.empty}>No signatures found</div>
      )}
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
  left: {
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
  name: {
    fontSize: 16,
    marginBottom: 4,
  },
  sub: {
    fontSize: 13,
    opacity: 0.7,
  },
  default: {
    fontSize: 12,
    color: "#4caf50",
  },
  empty: {
    textAlign: "center",
    padding: 40,
    opacity: 0.6,
  },
};
