import { Printer, Share2 } from "lucide-react";

export default function RecentHistory() {
  return (
    <div style={{ margin: "16px" }}>
      <div style={styles.header}>
        <h4>Recent History</h4>
        <button style={styles.btn}>View All</button>
      </div>

      {[1, 2, 3].map((i) => (
        <div key={i} style={styles.card}>
          <small style={{ color: "#3ddc97" }}>NO.: #QU02222</small>
          <h5>Customer name</h5>
          <p>Quotation: ₹ 000.00</p>
          <div style={styles.icons}>
            <Printer size={16} />
            <Share2 size={16} />
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  btn: {
    background: "#3ddc97",
    border: "none",
    padding: "6px 12px",
    borderRadius: "20px",
  },
  card: {
    background: "#1b1b1b",
    borderRadius: "14px",
    padding: "14px",
    marginBottom: "10px",
    position: "relative",
  },
  icons: {
    position: "absolute",
    right: "14px",
    bottom: "14px",
    display: "flex",
    gap: "10px",
  },
};
