import { useEffect, useState } from "react";
import { Printer, Share2 } from "lucide-react";
import API from "../services/api";
import { generateQuotationPDF } from "../pages/quotation/pdfGenerator";

export default function RecentHistory() {
  const [quotations, setQuotations] = useState([]);

  useEffect(() => {
    loadRecent();
  }, []);

  const loadRecent = async () => {
    try {
      const res = await API.get("/quotations?limit=5");
      setQuotations(res.data || []);
    } catch (err) {
      console.error("Failed to load quotations", err);
    }
  };

  return (
    <div style={{ margin: "16px" }}>
      <div style={styles.header}>
        <h4>Recent History</h4>
        <button style={styles.btn}>View All</button>
      </div>

      {quotations.length === 0 && (
        <div style={{ opacity: 0.6 }}>No quotations yet</div>
      )}

      {quotations.map((q) => (
        <div key={q._id} style={styles.card}>
          <small style={{ color: "#3ddc97" }}>NO.: #{q.quotationNo}</small>

          <h5>{q.customer?.name || "—"}</h5>

          <p>Quotation: ₹ {q.totalAmount || 0}</p>

          <div style={styles.icons}>
            <Printer
              size={16}
              style={{ cursor: "pointer" }}
              onClick={() => generateQuotationPDF(q)}
            />
            <Share2
              size={16}
              style={{ cursor: "pointer" }}
              onClick={() => shareQuotation(q)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- SHARE ---------------- */

function shareQuotation(q) {
  const text = `Quotation ${q.quotationNo}
Customer: ${q.customer?.name}
Amount: ₹ ${q.totalAmount}`;

  if (navigator.share) {
    navigator.share({ text });
  } else {
    navigator.clipboard.writeText(text);
    alert("Quotation details copied");
  }
}

/* ---------------- STYLES ---------------- */

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
    cursor: "pointer",
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
