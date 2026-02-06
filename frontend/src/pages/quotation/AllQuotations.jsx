import { useEffect, useState } from "react";
import { ArrowLeft, Printer, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import { generateQuotationPDFBlob } from "./pdfGenerator";

/* -------- DATE FORMAT -------- */

function formatDateTime(dateString) {
  if (!dateString) return { date: "--/--/----", time: "--:--" };

  const d = new Date(dateString);

  return {
    date: d.toLocaleDateString("en-GB"),
    time: d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
  };
}

async function shareQuotation(q) {
  const text = `Quotation ${q.quotationNo}
Customer: ${q.customer?.name}
Amount: ₹ ${q.totalAmount}`;

  const pdfBlob = generateQuotationPDFBlob(q);
  const pdfUrl = URL.createObjectURL(pdfBlob);

  // 📱 MOBILE SHARE
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

  // 💻 DESKTOP FALLBACK
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

/* -------- COMPONENT -------- */

export default function AllQuotations() {
  const navigate = useNavigate();
  const [quotations, setQuotations] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadQuotations(page);
  }, [page]);

  const loadQuotations = async (pageNo) => {
    const res = await API.get(`/quotations?page=${pageNo}&limit=10`);

    setQuotations(res.data.data || []);
    setTotalPages(res.data.totalPages || 1);
  };

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <ArrowLeft
          size={20}
          style={{ cursor: "pointer" }}
          onClick={() => navigate(-1)}
        />
        <h3>All Quotations</h3>
      </div>

      {/* LIST */}
      {quotations.map((q) => {
        const { date, time } = formatDateTime(q.createdAt);

        return (
          <div
            key={q._id}
            style={{ ...styles.card, cursor: "pointer" }}
            onClick={() => navigate(`/quotations/view/${q._id}`)}
          >
            {/* DATE */}
            <div style={styles.datetime}>
              <div>{date}</div>
              <div>{time}</div>
            </div>

            <small style={{ color: "#3ddc97" }}>NO.: #{q.quotationNo}</small>

            <h5 style={{ margin: "6px 0" }}>{q.customer?.name || "—"}</h5>

            <p style={{ margin: 0 }}>Quotation: ₹ {q.totalAmount || 0}</p>

            <div style={styles.icons} onClick={(e) => e.stopPropagation()}>
              <Printer
                size={16}
                onClick={() => printQuotation(q)}
                style={{ cursor: "pointer" }}
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

      {/* PAGINATION */}
      <div style={styles.pagination}>
        <button
          style={styles.pageBtn}
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Prev
        </button>

        <span style={{ opacity: 0.7 }}>
          Page {page} of {totalPages}
        </span>

        <button
          style={styles.pageBtn}
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* -------- PRINT -------- */

function printQuotation(q) {
  const pdfBlob = generateQuotationPDFBlob(q);
  const pdfUrl = URL.createObjectURL(pdfBlob);

  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = pdfUrl;

  document.body.appendChild(iframe);
  iframe.onload = () => iframe.contentWindow.print();
}

/* -------- STYLES -------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0e0e0e",
    color: "#fff",
    paddingBottom: 80,
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 16,
    background: "#1c1c1c",
  },

  card: {
    background: "#1b1b1b",
    borderRadius: 14,
    padding: 14,
    margin: "10px 16px",
    position: "relative",
  },

  datetime: {
    position: "absolute",
    top: 14,
    right: 14,
    textAlign: "right",
    fontSize: 12,
    opacity: 0.7,
    lineHeight: "16px",
    pointerEvents: "none",
  },

  icons: {
    position: "absolute",
    right: 14,
    bottom: 14,
    display: "flex",
    gap: 10,
    zIndex: 5,
  },

  pagination: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 16px",
    marginTop: 10,
  },

  pageBtn: {
    background: "#3ddc97",
    border: "none",
    padding: "6px 14px",
    borderRadius: 20,
    cursor: "pointer",
    fontSize: 12,
  },
};
