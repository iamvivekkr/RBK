import { useEffect, useState } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

import API from "../../services/api";

/* PICKERS */
import ProductPicker from "./ProductPicker";
import CustomerPicker from "./CustomerPicker";
import BankPicker from "./BankPicker";
import SignaturePicker from "./SignaturePicker";
import AttachmentsPicker from "./AttachmentsPicker";
import QuotationPreview from "./QuotationPreview";

export default function Quotation() {
  const navigate = useNavigate();

  /* ================= CORE STATE ================= */

  const [quotation, setQuotation] = useState({
    document: {
      prefix: "EST",
      number: 2,
      date: new Date().toISOString().slice(0, 10),
      dueDate: "",
      title: "Quotation",
    },

    exportInvoice: false,

    customer: null,
    products: [],

    dispatchAddress: null,
    shippingAddress: null,

    bank: null, // {type:"CASH"} OR bank object
    signature: null, // "NONE" OR signature object

    reference: "",
    notes: "",
    terms: "",

    extraDiscount: 0,
    charges: [],

    attachments: [],

    totals: {
      subTotal: 0,
      grandTotal: 0,
    },
  });

  /* ================= UI STATE ================= */

  const [activePicker, setActivePicker] = useState(null);
  // product | customer | bank | signature | attachments | discount | preview

  /* ================= TOTAL CALCULATION ================= */

  useEffect(() => {
    let sub = 0;
    quotation.products.forEach((p) => {
      sub += p.qty * p.price;
    });

    let chargesTotal = 0;
    quotation.charges.forEach((c) => {
      chargesTotal += Number(c.amount || 0);
    });

    let total = sub + chargesTotal - Number(quotation.extraDiscount || 0);

    setQuotation((q) => ({
      ...q,
      totals: {
        subTotal: sub,
        grandTotal: total < 0 ? 0 : total,
      },
    }));
  }, [quotation.products, quotation.charges, quotation.extraDiscount]);

  /* ================= CREATE ================= */

  const createQuotation = async () => {
    if (!quotation.customer || quotation.products.length === 0) {
      alert("Customer and Products are required");
      return;
    }

    await API.post("/quotations", quotation);
    setActivePicker("preview");
  };

  /* =====================================================
     PICKERS (FULL-SCREEN OVERLAYS)
  ===================================================== */

  if (activePicker === "product") {
    return (
      <ProductPicker
        selectedItems={quotation.products}
        onDone={(items) => {
          if (items) {
            setQuotation({ ...quotation, products: items });
          }
          setActivePicker(null);
        }}
      />
    );
  }

  if (activePicker === "customer") {
    return (
      <CustomerPicker
        selectedCustomer={quotation.customer}
        onDone={(customer) => {
          if (customer) {
            setQuotation({ ...quotation, customer });
          }
          setActivePicker(null);
        }}
      />
    );
  }

  if (activePicker === "bank") {
    return (
      <BankPicker
        selectedBank={quotation.bank}
        onDone={(bank) => {
          if (bank !== null) {
            setQuotation({ ...quotation, bank });
          }
          setActivePicker(null);
        }}
      />
    );
  }

  if (activePicker === "signature") {
    return (
      <SignaturePicker
        selectedSignature={quotation.signature}
        onDone={(signature) => {
          if (signature !== null) {
            setQuotation({ ...quotation, signature });
          }
          setActivePicker(null);
        }}
      />
    );
  }

  if (activePicker === "attachments") {
    return (
      <AttachmentsPicker
        attachments={quotation.attachments}
        onDone={(files) => {
          if (files) {
            setQuotation({ ...quotation, attachments: files });
          }
          setActivePicker(null);
        }}
      />
    );
  }

  if (activePicker === "preview") {
    return (
      <QuotationPreview
        quotation={quotation}
        onBack={() => setActivePicker(null)}
      />
    );
  }

  /* =====================================================
     MAIN QUOTATION UI (ALWAYS PRESENT)
  ===================================================== */

  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <ArrowLeft onClick={() => navigate(-1)} />
        <h3>
          {quotation.document.prefix}-{quotation.document.number}
        </h3>
        <Pencil />
      </div>

      {/* EXPORT */}
      <Section>
        <label>
          <input
            type="checkbox"
            checked={quotation.exportInvoice}
            onChange={(e) =>
              setQuotation({ ...quotation, exportInvoice: e.target.checked })
            }
          />{" "}
          Export / SEZ
        </label>
      </Section>

      {/* CUSTOMER */}
      <Section title="Customer">
        <Row
          label={
            quotation.customer ? quotation.customer.name : "Select Customer"
          }
          action="Change"
          onClick={() => setActivePicker("customer")}
        />
      </Section>

      {/* PRODUCTS */}
      <Section title="Products">
        {quotation.products.length === 0 ? (
          <Row
            label="Select Products"
            action="Add"
            onClick={() => setActivePicker("product")}
          />
        ) : (
          quotation.products.map((p, i) => (
            <div key={i} style={styles.itemRow}>
              <span>
                {p.name} × {p.qty}
              </span>
              <strong>₹ {p.qty * p.price}</strong>
            </div>
          ))
        )}
        <Row
          label="Add / Edit Products"
          action="Edit"
          onClick={() => setActivePicker("product")}
        />
      </Section>

      {/* ADDRESSES */}
      <Section title="Dispatch Address">
        <Row label="Select Dispatch Address" action="Add" />
      </Section>

      <Section title="Shipping Address">
        <Row label="Select Shipping Address" action="Add" />
      </Section>

      {/* BANK */}
      <Section title="Bank">
        <Row
          label={
            quotation.bank?.type === "CASH"
              ? "Cash"
              : quotation.bank?.bankName || "Select Bank"
          }
          action="Change"
          onClick={() => setActivePicker("bank")}
        />
      </Section>

      {/* SIGNATURE */}
      <Section title="Signature">
        <Row
          label={
            quotation.signature === "NONE"
              ? "None"
              : quotation.signature?.name || "Select Signature"
          }
          action="Change"
          onClick={() => setActivePicker("signature")}
        />
      </Section>

      {/* OPTIONAL TEXT */}
      <Section title="Reference">
        <Row
          label={quotation.reference || "Add Reference"}
          action="Edit"
          onClick={() => {
            const v = prompt("Reference", quotation.reference);
            if (v !== null) setQuotation({ ...quotation, reference: v });
          }}
        />
      </Section>

      <Section title="Notes">
        <Row
          label={quotation.notes || "Add Notes"}
          action="Edit"
          onClick={() => {
            const v = prompt("Notes", quotation.notes);
            if (v !== null) setQuotation({ ...quotation, notes: v });
          }}
        />
      </Section>

      <Section title="Terms & Conditions">
        <Row
          label={quotation.terms || "Add Terms"}
          action="Edit"
          onClick={() => {
            const v = prompt("Terms", quotation.terms);
            if (v !== null) setQuotation({ ...quotation, terms: v });
          }}
        />
      </Section>

      {/* ATTACHMENTS */}
      <Section title="Attachments">
        <Row
          label={
            quotation.attachments.length
              ? `${quotation.attachments.length} file(s) added`
              : "Add Attachments"
          }
          action="Add"
          onClick={() => setActivePicker("attachments")}
        />
      </Section>

      {/* TOTAL BAR */}
      <div style={styles.totalBar}>
        <div>
          <div style={{ fontSize: 12, opacity: 0.7 }}>Total</div>
          <strong>₹ {quotation.totals.grandTotal}</strong>
        </div>
        <button style={styles.createBtn} onClick={createQuotation}>
          Create →
        </button>
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function Section({ title, children }) {
  return (
    <div style={styles.section}>
      {title && <div style={styles.sectionTitle}>{title}</div>}
      {children}
    </div>
  );
}

function Row({ label, action, onClick }) {
  return (
    <div style={styles.row} onClick={onClick}>
      <span>{label}</span>
      {action && <span style={styles.link}>{action}</span>}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0e0e0e",
    color: "#fff",
    paddingBottom: 100,
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    padding: 16,
    background: "#2a2a2a",
  },
  section: {
    background: "#1c1c1c",
    margin: 12,
    padding: 12,
    borderRadius: 12,
  },
  sectionTitle: {
    opacity: 0.7,
    marginBottom: 8,
  },
  row: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px 0",
    borderBottom: "1px solid #333",
    cursor: "pointer",
  },
  link: {
    color: "#5b7cfa",
  },
  itemRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
  },
  totalBar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "#111827",
    padding: 16,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  createBtn: {
    background: "#5b7cfa",
    border: "none",
    padding: "12px 18px",
    color: "#fff",
    borderRadius: 10,
    fontSize: 16,
    cursor: "pointer",
  },
};
