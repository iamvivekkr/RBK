import { Clipboard } from "lucide-react";

export default function FloatingButton() {
  return (
    <button style={styles.btn}>
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
  },
};
