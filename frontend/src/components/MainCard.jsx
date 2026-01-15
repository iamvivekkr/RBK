import { Clipboard } from "lucide-react";

export default function MainCard() {
  return (
    <div style={styles.card}>
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
  },
};
