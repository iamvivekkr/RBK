import { Clipboard } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function FloatingButton() {
  const navigate = useNavigate();
  return (
    <button
      style={styles.btn}
      onClick={() => navigate("/quotation")}
      aria-label="Go to quotation"
    >
      <Clipboard />
    </button>
  );
}

const styles = {
  btn: {
    position: "fixed",
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
    background: "#3ddc97",
    border: "none",
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    cursor: "pointer",
  },
};
