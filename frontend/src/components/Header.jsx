import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { label: "Profile", path: "/profile" },
    { label: "Customers", path: "/customers" },
    { label: "Products", path: "/products" },
    { label: "Banks", path: "/banks" },
    { label: "Signature", path: "/signature" },
    { label: "Shipping Charges", path: "/shipping" },
  ];

  return (
    <header style={styles.header}>
      <div style={styles.company} onClick={() => setOpen(!open)}>
        <span>RBK Company</span>
        <ChevronDown size={18} />
      </div>

      {open && (
        <div style={styles.dropdown}>
          {menuItems.map((item) => (
            <div
              key={item.label}
              style={styles.item}
              onClick={() => {
                navigate(item.path);
                setOpen(false);
              }}
            >
              {item.label}
            </div>
          ))}

          <div style={styles.divider} />

          <div style={{ ...styles.item, color: "#ff6b6b" }}>Logout</div>
        </div>
      )}
    </header>
  );
}

const styles = {
  header: {
    height: "56px",
    background: "#111",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    padding: "0 16px",
    position: "relative",
  },
  company: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    fontWeight: "600",
  },
  dropdown: {
    position: "absolute",
    top: "56px",
    left: "16px",
    background: "#1b1b1b",
    borderRadius: "10px",
    width: "200px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    overflow: "hidden",
    zIndex: 100,
  },
  item: {
    padding: "12px 14px",
    cursor: "pointer",
    fontSize: "14px",
  },
  divider: {
    height: "1px",
    background: "#333",
  },
};
