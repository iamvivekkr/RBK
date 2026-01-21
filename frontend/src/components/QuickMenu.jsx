import { Users, Box, Landmark, PenTool, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function QuickMenu() {
  const navigate = useNavigate();

  const items = [
    { icon: <Users />, label: "Customers", path: "/customers" },
    { icon: <Box />, label: "Products", path: "/products" },
    { icon: <Landmark />, label: "Banks", path: "/banks" },
    { icon: <PenTool />, label: "Signature", path: "/signatures" },
    {
      icon: <MapPin />,
      label: "Dispatch Address",
      path: "/dispatch-addresses",
    },
  ];

  return (
    <div style={styles.container}>
      {items.map((item, i) => (
        <div key={i} style={styles.item} onClick={() => navigate(item.path)}>
          {item.icon}
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(80px, 1fr))",
    gap: "12px",
    margin: "16px",
  },
  item: {
    background: "#1b1b1b",
    borderRadius: "12px",
    padding: "14px",
    textAlign: "center",
    fontSize: "13px",
    cursor: "pointer",
  },
};
