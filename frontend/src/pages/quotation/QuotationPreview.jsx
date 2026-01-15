import { ArrowLeft, Download } from "lucide-react";
import { generateQuotationPDF } from "./pdfGenerator";

export default function QuotationPreview({ quotation, onBack }) {
  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <ArrowLeft onClick={onBack} style={{ cursor: "pointer" }} />
        <h3>Quotation Preview</h3>
        <Download
          style={{ cursor: "pointer" }}
          onClick={() => generateQuotationPDF(quotation)}
        />
      </div>

      {/* BODY */}
      <div style={styles.body}>
        {/* COMPANY */}
        <h2>Quotation</h2>
        <p>
          {quotation.document?.prefix}-{quotation.document?.number}
        </p>

        {/* CUSTOMER */}
        <Section title="Customer">
          <p>{quotation.customer?.name}</p>
          <p>{quotation.customer?.phone}</p>
          {quotation.customer?.email && <p>{quotation.customer.email}</p>}
        </Section>

        {/* PRODUCTS */}
        <Section title="Items">
          {quotation.products.map((p, i) => (
            <div key={i} style={styles.row}>
              <span>
                {p.name} × {p.qty}
              </span>
              <strong>₹ {p.qty * p.price}</strong>
            </div>
          ))}
        </Section>

        {/* TOTALS */}
        <Section title="Summary">
          <Row label="Subtotal" value={`₹ ${quotation.totals.subTotal}`} />
          {quotation.extraDiscount > 0 && (
            <Row label="Discount" value={`- ₹ ${quotation.extraDiscount}`} />
          )}
          {quotation.charges.map((c, i) => (
            <Row key={i} label={c.label} value={`₹ ${c.amount}`} />
          ))}
          <Row
            label="Grand Total"
            value={`₹ ${quotation.totals.grandTotal}`}
            bold
          />
        </Section>

        {/* BANK */}
        {quotation.bank && (
          <Section title="Bank">
            <p>
              {quotation.bank.type === "CASH"
                ? "Cash"
                : quotation.bank.bankName}
            </p>
          </Section>
        )}

        {/* SIGNATURE */}
        {quotation.signature && quotation.signature !== "NONE" && (
          <Section title="Authorized Signature">
            <img
              src={quotation.signature.image}
              alt="signature"
              style={{ width: 120 }}
            />
            <p>{quotation.signature.name}</p>
          </Section>
        )}

        {/* NOTES */}
        {quotation.notes && (
          <Section title="Notes">
            <p>{quotation.notes}</p>
          </Section>
        )}

        {/* TERMS */}
        {quotation.terms && (
          <Section title="Terms & Conditions">
            <p>{quotation.terms}</p>
          </Section>
        )}
      </div>
    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

const Section = ({ title, children }) => (
  <div style={styles.section}>
    <h4>{title}</h4>
    {children}
  </div>
);

const Row = ({ label, value, bold }) => (
  <div style={styles.row}>
    <span>{label}</span>
    <strong style={bold ? {} : { fontWeight: "normal" }}>{value}</strong>
  </div>
);

/* ---------------- STYLES ---------------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#fff",
    color: "#000",
  },
  header: {
    display: "flex",
    gap: 12,
    padding: 16,
    borderBottom: "1px solid #ddd",
    alignItems: "center",
  },
  body: {
    padding: 24,
  },
  section: {
    marginBottom: 24,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 6,
  },
};
