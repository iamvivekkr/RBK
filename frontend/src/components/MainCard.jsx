import { Clipboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MainCard() {
  const navigate = useNavigate();

  return (
    <div style={styles.card} onClick={() => navigate("/quotation")}>
      <Clipboard size={36} />
      <h3>Quotation</h3>
    </div>
  );
}

const styles = {
  card: {
    background: "#1b1b1b",
    borderRadius: "16px",
    padding: "40px",
    textAlign: "center",
    margin: "16px",
    cursor: "pointer",
    transition: "0.2s ease",
  },
};
