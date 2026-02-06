import { useEffect, useState } from "react";
import { ArrowLeft, Download } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/api";
import { generateQuotationPDFBlob } from "./pdfGenerator";

export default function QuotationViewer() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pdfUrl, setPdfUrl] = useState(null);
  const [quotation, setQuotation] = useState(null);

  useEffect(() => {
    loadQuotation();
  }, []);

  const loadQuotation = async () => {
    try {
      const res = await API.get(`/quotations/${id}`);
      setQuotation(res.data);

      const blob = generateQuotationPDFBlob(res.data);
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (err) {
      console.error("Failed to load quotation", err);
    }
  };

  const downloadPdf = () => {
    if (!quotation || !pdfUrl) return;

    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `Quotation-${quotation.quotationNo}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
        <h4 style={{ flex: 1 }}>Quotation #{quotation?.quotationNo || ""}</h4>

        <Download
          size={20}
          style={{ cursor: "pointer" }}
          onClick={downloadPdf}
        />
      </div>

      {/* PDF VIEWER */}
      {pdfUrl ? (
        <iframe src={pdfUrl} title="Quotation PDF" style={styles.viewer} />
      ) : (
        <div style={{ padding: 20 }}>Loading PDF...</div>
      )}
    </div>
  );
}

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0e0e0e",
    color: "#fff",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 14,
    background: "#1c1c1c",
  },

  viewer: {
    width: "100%",
    height: "calc(100vh - 56px)",
    border: "none",
    background: "#fff",
  },
};
