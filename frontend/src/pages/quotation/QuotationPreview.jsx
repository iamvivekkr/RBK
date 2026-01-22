import { ArrowLeft, Download } from "lucide-react";
import { generateQuotationPDF } from "./pdfGenerator";

export default function QuotationPreview({ quotation, onBack }) {
  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <ArrowLeft onClick={onBack} style={{ cursor: "pointer" }} />
        <div>
          <div style={styles.headerTitle}>
            {quotation.document.prefix}-{quotation.document.number}
          </div>
          <div style={styles.headerSub}>Quotation</div>
        </div>
        <Download
          style={{ cursor: "pointer", marginLeft: "auto" }}
          onClick={() => generateQuotationPDF(quotation)}
        />
      </div>

      {/* CUSTOMER */}
      <Section title="Customer Details">
        <Card>
          <strong>{quotation.customer?.name}</strong>
          <div style={styles.muted}>
            Invoice Date: {quotation.document.date}
          </div>
          {quotation.customer?.phone && (
            <div style={styles.muted}>{quotation.customer.phone}</div>
          )}
          {quotation.customer?.email && (
            <div style={styles.muted}>{quotation.customer.email}</div>
          )}
        </Card>
      </Section>

      {/* SHIPPING */}
      {quotation.dispatchAddress && (
        <Section title="Shipping Address">
          <Card>
            <strong>{quotation.dispatchAddress.addressLine1}</strong>
            <div style={styles.muted}>
              {quotation.dispatchAddress.city},{" "}
              {quotation.dispatchAddress.state} -{" "}
              {quotation.dispatchAddress.pincode}
            </div>
          </Card>
        </Section>
      )}

      {/* ITEMS */}
      <Section title={`Items (${quotation.products.length})`}>
        <Card>
          {quotation.products.map((p, i) => (
            <div key={i} style={styles.itemRow}>
              <div>
                <strong>{p.name}</strong>
                <div style={styles.muted}>
                  Qty: {p.qty} {p.unit || ""}
                </div>
              </div>
              <strong>₹{p.qty * p.price}</strong>
            </div>
          ))}
        </Card>
      </Section>

      {/* BILL SUMMARY */}
      <Section title="Bill Summary">
        <Card>
          {quotation.charges.map((c, i) => (
            <SummaryRow key={i} label={c.label} value={`₹${c.amount}`} />
          ))}

          <SummaryRow
            label={`Subtotal (${quotation.products.length} item)`}
            value={`₹${quotation.totals.subTotal}`}
          />

          {quotation.totals.tax > 0 && (
            <SummaryRow
              label="GST"
              value={`₹${quotation.totals.tax.toFixed(2)}`}
            />
          )}

          {quotation.extraDiscount > 0 && (
            <SummaryRow
              label="Discount"
              value={`-₹${quotation.extraDiscount}`}
              green
            />
          )}

          <Divider />

          <SummaryRow
            label="Total Amount"
            value={`₹${quotation.totals.grandTotal}`}
            bold
          />
        </Card>
      </Section>

      {/* OTHERS */}
      <Section title="Others">
        <Card>
          {quotation.bank && (
            <OtherRow
              label="Bank"
              value={
                quotation.bank.type === "CASH"
                  ? "Cash"
                  : quotation.bank.bankName
              }
            />
          )}

          {quotation.signature && quotation.signature !== "NONE" && (
            <OtherRow label="Signature" value={quotation.signature.name} />
          )}

          {quotation.reference && (
            <OtherRow label="Reference" value={quotation.reference} />
          )}
        </Card>
      </Section>
    </div>
  );
}

/* ---------------- SMALL COMPONENTS ---------------- */

const Section = ({ title, children }) => (
  <div style={styles.section}>
    <div style={styles.sectionTitle}>{title}</div>
    {children}
  </div>
);

const Card = ({ children }) => <div style={styles.card}>{children}</div>;

const SummaryRow = ({ label, value, bold, green }) => (
  <div style={styles.row}>
    <span>{label}</span>
    <span
      style={{
        fontWeight: bold ? "bold" : "normal",
        color: green ? "#22c55e" : "#fff",
      }}
    >
      {value}
    </span>
  </div>
);

const OtherRow = ({ label, value }) => (
  <div style={styles.row}>
    <span>{label}</span>
    <span style={styles.muted}>{value}</span>
  </div>
);

const Divider = () => <div style={styles.divider} />;

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
    padding: 16,
    background: "#2a2a2a",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerSub: {
    fontSize: 13,
    opacity: 0.7,
  },
  section: {
    margin: 12,
  },
  sectionTitle: {
    opacity: 0.7,
    marginBottom: 8,
  },
  card: {
    background: "#1c1c1c",
    borderRadius: 14,
    padding: 14,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  muted: {
    opacity: 0.6,
    fontSize: 13,
  },
  divider: {
    height: 1,
    background: "#333",
    margin: "10px 0",
  },
};
