import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import API from "../../services/api";

export default function DispatchAddressPicker({ selectedAddress, onDone }) {
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    const res = await API.get("/dispatch-addresses");
    setAddresses(res.data);
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <ArrowLeft onClick={() => onDone(null)} style={{ cursor: "pointer" }} />
        <h3>Select Dispatch Address</h3>
      </div>

      {addresses.map((a) => {
        const isSelected = selectedAddress?._id === a._id;

        return (
          <div
            key={a._id}
            style={{
              ...styles.card,
              border: isSelected ? "2px solid #5b7cfa" : "none",
            }}
            onClick={() => onDone(a)}
          >
            <div style={styles.line}>{a.addressLine1}</div>
            {a.addressLine2 && <div style={styles.sub}>{a.addressLine2}</div>}
            <div style={styles.sub}>
              {a.city}, {a.state} – {a.pincode}
            </div>
          </div>
        );
      })}
    </div>
  );
}

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
    alignItems: "center",
    background: "#2a2a2a",
  },
  card: {
    margin: 16,
    padding: 16,
    background: "#1c1c1c",
    borderRadius: 14,
    cursor: "pointer",
  },
  line: { fontSize: 15 },
  sub: { fontSize: 13, opacity: 0.7, marginTop: 4 },
};
