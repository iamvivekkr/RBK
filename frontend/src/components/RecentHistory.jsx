import { useEffect, useState } from "react";
import { Printer, Share2 } from "lucide-react";
import API from "../services/api";
import {
  generateQuotationPDF,
  generateQuotationPDFBlob,
} from "../pages/quotation/pdfGenerator";

/* ---------------- DATE FORMATTER ---------------- */

function formatDateTime(dateString) {
  if (!dateString) {
    return { date: "--/--/----", time: "--:--" };
  }

  const d = new Date(dateString);

  const date = d.toLocaleDateString("en-GB"); // DD/MM/YYYY
  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return { date, time };
}

/* ---------------- COMPONENT ---------------- */

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
      {/* HEADER */}
      <div style={styles.header}>
        <h4>Recent History</h4>
        <button style={styles.btn}>View All</button>
      </div>

      {quotations.length === 0 && (
        <div style={{ opacity: 0.6 }}>No quotations yet</div>
      )}

      {quotations.map((q) => {
        const { date, time } = formatDateTime(q.createdAt);

        return (
          <div key={q._id} style={styles.card}>
            {/* DATE & TIME */}
            <div style={styles.datetime}>
              <div>{date}</div>
              <div>{time}</div>
            </div>

            <small style={{ color: "#3ddc97" }}>NO.: #{q.quotationNo}</small>

            <h5 style={{ margin: "6px 0" }}>{q.customer?.name || "—"}</h5>

            <p style={{ margin: 0 }}>Quotation: ₹ {q.totalAmount || 0}</p>

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
        );
      })}
    </div>
  );
}

/* ---------------- SHARE LOGIC ---------------- */

async function shareQuotation(q) {
  const text = `Quotation ${q.quotationNo}
Customer: ${q.customer?.name}
Amount: ₹ ${q.totalAmount}`;

  const pdfBlob = generateQuotationPDFBlob(q);
  const pdfUrl = URL.createObjectURL(pdfBlob);

  // 📱 MOBILE: native share with PDF
  if (
    navigator.share &&
    navigator.canShare &&
    navigator.canShare({
      files: [
        new File([pdfBlob], "quotation.pdf", {
          type: "application/pdf",
        }),
      ],
    })
  ) {
    await navigator.share({
      title: `Quotation ${q.quotationNo}`,
      text,
      files: [
        new File([pdfBlob], "quotation.pdf", {
          type: "application/pdf",
        }),
      ],
    });
    return;
  }

  // 💻 DESKTOP OPTIONS
  const links = desktopShare(q, pdfUrl);

  const choice = window.prompt(
    "Share quotation:\n1 = WhatsApp\n2 = Email\n3 = Download PDF",
  );

  if (choice === "1") {
    window.open(links.whatsapp, "_blank");
  } else if (choice === "2") {
    window.location.href = links.mail;
  } else {
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `Quotation-${q.quotationNo}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

/* ---------------- DESKTOP SHARE LINKS ---------------- */

function desktopShare(q, pdfUrl) {
  const text = `Quotation ${q.quotationNo}
Customer: ${q.customer?.name}
Amount: ₹ ${q.totalAmount}`;

  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(pdfUrl);

  return {
    whatsapp: `https://wa.me/?text=${encodedText}%0A%0A${encodedUrl}`,
    mail: `mailto:?subject=Quotation ${q.quotationNo}&body=${encodedText}%0A%0A${encodedUrl}`,
  };
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
    fontSize: "12px",
  },
  card: {
    background: "#1b1b1b",
    borderRadius: "14px",
    padding: "14px",
    marginBottom: "10px",
    position: "relative",
  },
  datetime: {
    position: "absolute",
    top: "14px",
    right: "14px",
    textAlign: "right",
    fontSize: "12px",
    opacity: 0.7,
    lineHeight: "16px",
    pointerEvents: "none", // 👈 prevents click blocking
  },
  icons: {
    position: "absolute",
    right: "14px",
    bottom: "14px",
    display: "flex",
    gap: "10px",
    zIndex: 5, // 👈 ensures clickable
  },
};
