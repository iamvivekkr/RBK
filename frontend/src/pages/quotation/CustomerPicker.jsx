import { useEffect, useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import API from "../../services/api";

export default function CustomerPicker({ selectedCustomer, onDone }) {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");

  /* ---------------- LOAD CUSTOMERS ---------------- */
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    const res = await API.get("/customers");
    setCustomers(res.data || []);
  };

  const filteredCustomers = customers.filter((c) =>
    `${c.name} ${c.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  /* ---------------- UI ---------------- */
  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <ArrowLeft onClick={() => onDone(null)} style={{ cursor: "pointer" }} />
        <h3>Select Customer</h3>
      </div>

      {/* SEARCH */}
      <div style={styles.searchBox}>
        <Search size={18} />
        <input
          placeholder="Search customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
      </div>

      {/* CUSTOMER LIST */}
      <div style={{ paddingBottom: 100 }}>
        {filteredCustomers.map((c) => (
          <div
            key={c._id}
            style={{
              ...styles.card,
              border:
                selectedCustomer?._id === c._id
                  ? "1px solid #5b7cfa"
                  : "1px solid transparent",
            }}
            onClick={() => onDone(c)}
          >
            <div>
              <div style={styles.name}>{c.name}</div>
              <div style={styles.sub}>{c.phone}</div>
              {c.companyName && <div style={styles.sub}>{c.companyName}</div>}
            </div>
          </div>
        ))}

        {filteredCustomers.length === 0 && (
          <div style={styles.empty}>No customers found</div>
        )}
      </div>
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
  searchBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "#1c1c1c",
    margin: 12,
    padding: "10px 12px",
    borderRadius: 10,
  },
  searchInput: {
    flex: 1,
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    fontSize: 14,
  },
  card: {
    margin: "8px 12px",
    padding: 14,
    background: "#1c1c1c",
    borderRadius: 12,
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
  empty: {
    textAlign: "center",
    padding: 40,
    opacity: 0.6,
  },
};
