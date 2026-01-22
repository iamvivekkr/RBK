import { useEffect, useState } from "react";
import { ArrowLeft, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

import API from "../../services/api";

/* PICKERS */
import ProductPicker from "./ProductPicker";
import CustomerPicker from "./CustomerPicker";
import BankPicker from "./BankPicker";
import SignaturePicker from "./SignaturePicker";
import AttachmentsPicker from "./AttachmentsPicker";
import QuotationPreview from "./QuotationPreview";
import DispatchAddressPicker from "./DispatchAddressPicker";

export default function Quotation() {
  const navigate = useNavigate();

  /* ================= CORE STATE ================= */

  const [quotation, setQuotation] = useState({
    document: {
      prefix: "",
      number: "",
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
    // Products total
    const productsTotal = quotation.products.reduce(
      (sum, p) => sum + p.qty * p.price,
      0,
    );

    // Charges & Tax
    let chargesTotal = 0;
    let totalTax = 0;

    quotation.charges.forEach((c) => {
      chargesTotal += c.amount;

      if (c.taxRate > 0) {
        totalTax += (c.amount * c.taxRate) / 100;
      }
    });

    // Discount
    const discount = Number(quotation.extraDiscount || 0);

    // Sub Total (charges + discount applied, NO TAX)
    const subTotal = productsTotal + chargesTotal;

    // Grand Total (tax added AFTER)
    const grandTotal = subTotal + totalTax - discount;

    setQuotation((q) => ({
      ...q,
      totals: {
        subTotal: Number(subTotal.toFixed(2)),
        tax: Number(totalTax.toFixed(2)),
        grandTotal: Number(grandTotal.toFixed(2)),
      },
    }));
  }, [quotation.products, quotation.charges, quotation.extraDiscount]);

  const [textSheet, setTextSheet] = useState({
    open: false,
    field: null, // "notes" | "reference" | "terms"
    value: "",
  });

  const [toast, setToast] = useState({
    open: false,
    message: "",
  });

  const showToast = (message) => {
    setToast({ open: true, message });

    setTimeout(() => {
      setToast({ open: false, message: "" });
    }, 2500);
  };

  const openTextSheet = (field) => {
    setTextSheet({
      open: true,
      field,
      value: quotation[field] || "",
    });
  };

  const saveTextSheet = () => {
    setQuotation({
      ...quotation,
      [textSheet.field]: textSheet.value,
    });

    setTextSheet({ open: false, field: null, value: "" });
  };
  const { id } = useParams();

  useEffect(() => {
    if (id) return; // edit mode → don't generate

    const fetchNext = async () => {
      const { data } = await API.get("/quotations/next-number");

      setQuotation((q) => ({
        ...q,
        document: {
          ...q.document,
          prefix: data.prefix,
          number: data.number,
          date: data.date,
        },
      }));
    };

    fetchNext();
  }, [id]);

  const [docSheet, setDocSheet] = useState({
    open: false,
    prefix: "",
    number: "",
    date: "",
    dueDate: "",
  });

  const [gstType, setGstType] = useState("with"); // "with" | "without"

  /* ================= CREATE ================= */

  const createQuotation = async () => {
    if (!quotation.customer || quotation.products.length === 0) {
      alert("Customer and Products are required");
      return;
    }

    // 🔑 MAP FRONTEND STATE → BACKEND SCHEMA
    const payload = {
      customer: quotation.customer._id,

      items: quotation.products.map((p) => ({
        productId: p._id,
        name: p.name,
        hsn: p.hsn,
        unit: p.unit,
        quantity: p.qty,
        price: p.price,
        taxRate: p.taxRate || 0,
        total: p.qty * p.price,
      })),

      discount: Number(quotation.extraDiscount || 0),

      extraCharges: quotation.charges.map((c) => ({
        label: c.label,
        amount: Number(c.amount),
        taxRate: Number(c.taxRate || 0),
      })),

      dispatchAddress: quotation.dispatchAddress,
      shippingAddress: quotation.shippingAddress,

      bank: quotation.bank?._id || null,
      signature: quotation.signature?._id || null,

      reference: quotation.reference,
      notes: quotation.notes,
      terms: quotation.terms,

      attachments: quotation.attachments.map((a) => a.name),
    };

    try {
      await API.post("/quotations", payload);
      setActivePicker("preview");
    } catch (err) {
      console.error(err);
      alert("Failed to save quotation");
    }
  };

  const requireProducts = () => {
    if (quotation.products.length === 0) {
      showToast("Please add products first");
      return false;
    }
    return true;
  };

  const [chargeSheet, setChargeSheet] = useState({
    open: false,
    type: null, // "discount" | "delivery" | "packaging"
    mode: "amount", // "amount" | "percent"
    value: "",
    taxRate: 0,
    taxType: "without", // "with" | "without"
  });

  const openDiscountSheet = () => {
    setChargeSheet({
      open: true,
      type: "discount",
      mode: "amount",
      value: quotation.extraDiscount || "",
      taxRate: 0,
      taxType: "without",
    });
  };

  const openChargeSheet = (type) => {
    const existing = quotation.charges.find((c) => c.type === type);

    setChargeSheet({
      open: true,
      type,
      mode: "amount",
      value: existing ? existing.amount : "",
      taxRate: existing ? existing.taxRate : 0,
      taxType: existing ? existing.taxType : "without",
    });
  };

  const saveDiscount = () => {
    let discount = Number(chargeSheet.value || 0);

    if (chargeSheet.mode === "percent") {
      discount = (quotation.totals.subTotal * discount) / 100;
    }

    setQuotation({
      ...quotation,
      extraDiscount: discount,
    });

    setChargeSheet({ open: false });
  };

  const saveCharge = () => {
    let amount = Number(chargeSheet.value || 0);
    const taxRate = Number(chargeSheet.taxRate || 0);

    // If amount includes tax, extract base amount
    if (chargeSheet.taxType === "with" && taxRate > 0) {
      amount = amount / (1 + taxRate / 100);
      amount = Number(amount.toFixed(2)); // round nicely
    }

    setQuotation({
      ...quotation,
      charges: [
        ...quotation.charges.filter((c) => c.type !== chargeSheet.type),
        {
          type: chargeSheet.type,
          label:
            chargeSheet.type === "delivery"
              ? "Delivery/Shipping Charges"
              : "Packaging Charges",
          amount,
          taxRate,
          taxType: chargeSheet.taxType,
        },
      ],
    });

    setChargeSheet({ open: false });
  };

  const isMobile = window.innerWidth <= 768;

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

  if (activePicker === "dispatch") {
    return (
      <DispatchAddressPicker
        selectedAddress={quotation.dispatchAddress}
        onDone={(address) => {
          if (address) {
            setQuotation({ ...quotation, dispatchAddress: address });
          }
          setActivePicker(null);
        }}
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
        <ArrowLeft onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />
        <h3 style={{ flex: 1 }}>Create Quotation</h3>
      </div>

      <div style={styles.quoteCard}>
        <div style={styles.quoteCardTop}>
          <div>
            <div style={styles.quoteLabel}>Quotation #</div>
            <div style={styles.quoteNumber}>
              {quotation.document.prefix}-{quotation.document.number}
            </div>
            <div style={styles.quoteDate}>
              {quotation.document.date}
              {quotation.document.dueDate && (
                <> , Due on : {quotation.document.dueDate}</>
              )}
            </div>
          </div>

          <span
            style={{ ...styles.link, cursor: "pointer" }}
            onClick={() =>
              setDocSheet({
                open: true,
                prefix: quotation.document.prefix,
                number: quotation.document.number,
                date: quotation.document.date,
                dueDate: quotation.document.dueDate,
              })
            }
          >
            Edit
          </span>
        </div>

        <div style={styles.gstRow}>
          <label style={{ cursor: "pointer" }}>
            <input
              type="radio"
              name="gstType"
              checked={gstType === "with"}
              onChange={() => setGstType("with")}
            />{" "}
            With GST
          </label>

          <label style={{ cursor: "pointer" }}>
            <input
              type="radio"
              name="gstType"
              checked={gstType === "without"}
              onChange={() => setGstType("without")}
            />{" "}
            Without GST
          </label>
        </div>
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
        {!quotation.customer ? (
          <div
            style={styles.selectCard}
            onClick={() => setActivePicker("customer")}
          >
            <span style={styles.plus}>＋</span>
            <span style={styles.selectText}>Select Customer</span>
          </div>
        ) : (
          <div style={styles.card}>
            <span style={styles.cardTitle}>{quotation.customer.name}</span>
            <div style={styles.cardActions}>
              <span style={styles.link}>View</span>
              <span
                style={styles.link}
                onClick={() => setActivePicker("customer")}
              >
                Change
              </span>
            </div>
          </div>
        )}
      </Section>

      {/* PRODUCTS */}
      <Section title="Products">
        {quotation.products.length === 0 ? (
          <div
            style={styles.selectCard}
            onClick={() => setActivePicker("product")}
          >
            <span style={styles.plus}>＋</span>
            <span style={styles.selectText}>Select Products</span>
          </div>
        ) : (
          <>
            <div style={styles.editHeader}>
              <span />
              <span
                style={styles.editBtn}
                onClick={() => setActivePicker("product")}
              >
                🖍 Add / Edit
              </span>
            </div>

            {quotation.products.map((p, i) => (
              <div key={i} style={styles.productCard}>
                <div>
                  <strong>{p.name}</strong>
                  <div style={styles.muted}>
                    × {p.qty} {p.unit || ""}
                  </div>
                </div>
                <strong>₹ {p.qty * p.price}</strong>
              </div>
            ))}

            <div
              style={styles.addMoreBtn}
              onClick={() => setActivePicker("product")}
            >
              ＋ Add More Items
            </div>
          </>
        )}
      </Section>

      {/* OPTIONAL */}
      <div style={styles.optionalHeader}>
        <span>Optional</span>
        {/* <span style={styles.addChargeBtn}>＋ Additional Charges</span> */}
      </div>

      <div style={styles.optionalCard}>
        {/* DISPATCH */}
        <OptionalRow
          icon="🚚"
          label="Dispatch Address"
          value={
            quotation.dispatchAddress
              ? `${quotation.dispatchAddress.addressLine1}, ${quotation.dispatchAddress.city}`
              : ""
          }
          action={quotation.dispatchAddress ? "Change" : ""}
          onClick={() => setActivePicker("dispatch")}
        />

        {/* SHIPPING */}
        {/* <OptionalRow
          icon="📍"
          label="Add Shipping Address"
          value={quotation.shippingAddress || "Add Shipping Address"}
          action={quotation.shippingAddress ? "Change" : null}
        /> */}

        {/* BANK */}
        <OptionalRow
          icon="🏦"
          label="Bank"
          value={
            quotation.bank?.type === "CASH" ? "Cash" : quotation.bank?.bankName
          }
          action={quotation.bank ? "Change" : null}
          onClick={() => setActivePicker("bank")}
        />

        {/* SIGNATURE */}
        <OptionalRow
          icon="✍️"
          label="Signature"
          value={quotation.signature?.name || ""}
          action={quotation.signature ? "Change" : null}
          onClick={() => setActivePicker("signature")}
        />

        <Divider />

        {/* TEXT */}
        <OptionalRow
          icon="📘"
          label="Reference"
          value={quotation.reference || ""}
          action={quotation.reference ? "Edit" : null}
          onClick={() => openTextSheet("reference")}
        />

        <OptionalRow
          icon="📝"
          label="Notes"
          value={quotation.notes || ""}
          action={quotation.notes ? "Edit" : null}
          onClick={() => openTextSheet("notes")}
        />

        <OptionalRow
          icon="📜"
          label="Terms & Conditions"
          value={quotation.terms || ""}
          action={quotation.terms ? "Edit" : null}
          onClick={() => openTextSheet("terms")}
        />

        <Divider />

        {/* Extra Discount */}
        {quotation.extraDiscount > 0 ? (
          <OptionalRow
            icon="₹"
            label="Extra Discount"
            value={`₹${quotation.extraDiscount}`}
            action="Change"
            onClick={openDiscountSheet}
          />
        ) : (
          <OptionalRow
            icon="₹"
            label="Extra Discount"
            value=""
            onClick={() => {
              if (!requireProducts()) return;
              openDiscountSheet();
            }}
          />
        )}

        {/* DELIVERY */}
        {quotation.charges.find((c) => c.type === "delivery") ? (
          quotation.charges
            .filter((c) => c.type === "delivery")
            .map((c, i) => (
              <OptionalRow
                key={i}
                icon="₹"
                label="Delivery / Shipping Charges"
                value={`₹${c.amount} + ${c.taxRate}%`}
                action="Change"
                onClick={() => openChargeSheet("delivery")}
              />
            ))
        ) : (
          <OptionalRow
            icon="₹"
            label="Delivery / Shipping Charges"
            value=""
            onClick={() => {
              if (!requireProducts()) return;
              openChargeSheet("delivery");
            }}
          />
        )}

        {/* PACKAGING */}
        {quotation.charges.find((c) => c.type === "packaging") ? (
          quotation.charges
            .filter((c) => c.type === "packaging")
            .map((c, i) => (
              <OptionalRow
                key={i}
                icon="₹"
                label="Packaging Charges"
                value={`₹${c.amount} + ${c.taxRate}%`}
                action="Change"
                onClick={() => openChargeSheet("packaging")}
              />
            ))
        ) : (
          <OptionalRow
            icon="₹"
            label="Packaging Charges"
            value=""
            onClick={() => {
              if (!requireProducts()) return;
              openChargeSheet("packaging");
            }}
          />
        )}

        <Divider />

        {/* ATTACHMENTS */}
        {quotation.products.length > 0 && (
          <OptionalRow
            icon="📎"
            label="Attachments"
            value={
              quotation.attachments.length
                ? `${quotation.attachments.length} file(s)`
                : ""
            }
            action={quotation.attachments.length ? "Change" : "Add"}
            onClick={() => setActivePicker("attachments")}
          />
        )}
      </div>

      {/* TOTAL BAR */}
      {quotation.products.length > 0 && (
        <div
          style={{
            ...styles.totalBar,
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center",
            gap: isMobile ? 12 : 0,
          }}
        >
          <div style={{ width: "100%" }}>
            {quotation.charges.map((c, i) => (
              <div key={i} style={styles.totalRow}>
                <span>
                  {c.label} ({c.taxRate}%)
                </span>
                <span>₹{c.amount}</span>
              </div>
            ))}

            <div style={styles.totalRow}>
              <span>Sub Total</span>
              <span>₹{quotation.totals.subTotal}</span>
            </div>

            {quotation.extraDiscount > 0 && (
              <div style={styles.totalRowGreen}>
                <span>Discount</span>
                <span>-₹{quotation.extraDiscount}</span>
              </div>
            )}

            {quotation.totals.tax > 0 && (
              <div style={styles.totalRow}>
                <span>Total Tax</span>
                <span>₹{quotation.totals.tax.toFixed(2)}</span>
              </div>
            )}
          </div>

          <div style={styles.totalFooter}>
            <div>
              <div style={{ fontSize: 14, opacity: 0.7 }}>Total Amount</div>
              <div style={{ fontSize: 16, fontWeight: "bold" }}>
                ₹{quotation.totals.grandTotal}
              </div>
            </div>

            <button style={styles.createBtn} onClick={createQuotation}>
              Create →
            </button>
          </div>
        </div>
      )}

      {textSheet.open && (
        <div style={styles.sheetOverlay}>
          <div style={styles.sheet}>
            <div style={styles.sheetHeader}>
              <strong>
                {textSheet.field === "notes"
                  ? "Notes"
                  : textSheet.field === "reference"
                    ? "Reference"
                    : "Terms & Conditions"}
              </strong>

              <span
                style={styles.sheetClose}
                onClick={() =>
                  setTextSheet({ open: false, field: null, value: "" })
                }
              >
                ✕
              </span>
            </div>

            <textarea
              style={styles.sheetTextarea}
              placeholder="Add text"
              value={textSheet.value}
              onChange={(e) =>
                setTextSheet({ ...textSheet, value: e.target.value })
              }
            />

            <button style={styles.sheetSaveBtn} onClick={saveTextSheet}>
              Save
            </button>
          </div>
        </div>
      )}
      {toast.open && <div style={styles.toast}>{toast.message}</div>}
      {chargeSheet.open && (
        <div style={styles.sheetOverlay}>
          <div style={styles.sheet}>
            <div style={styles.sheetHeader}>
              <strong>
                {chargeSheet.type === "discount"
                  ? "Add Extra Discount"
                  : chargeSheet.type === "delivery"
                    ? "Delivery / Shipping Charges"
                    : "Packaging Charges"}
              </strong>
              <span
                style={styles.sheetClose}
                onClick={() => setChargeSheet({ open: false })}
              >
                ✕
              </span>
            </div>

            {/* ₹ / % TOGGLE */}
            <div style={styles.toggleRow}>
              <label>
                <input
                  type="radio"
                  checked={chargeSheet.mode === "amount"}
                  onChange={() =>
                    setChargeSheet({ ...chargeSheet, mode: "amount" })
                  }
                />{" "}
                ₹
              </label>

              <label>
                <input
                  type="radio"
                  checked={chargeSheet.mode === "percent"}
                  onChange={() =>
                    setChargeSheet({ ...chargeSheet, mode: "percent" })
                  }
                />{" "}
                %
              </label>
            </div>

            {/* INPUT */}
            <input
              style={styles.sheetInput}
              type="number"
              placeholder="0.0"
              value={chargeSheet.value}
              onChange={(e) =>
                setChargeSheet({ ...chargeSheet, value: e.target.value })
              }
            />

            {/* TAX OPTIONS (ONLY FOR CHARGES) */}
            {chargeSheet.type !== "discount" && (
              <>
                <select
                  style={styles.sheetInput}
                  value={chargeSheet.taxRate}
                  onChange={(e) =>
                    setChargeSheet({
                      ...chargeSheet,
                      taxRate: Number(e.target.value),
                    })
                  }
                >
                  <option value={0}>0%</option>
                  <option value={5}>5%</option>
                  <option value={12}>12%</option>
                  <option value={18}>18%</option>
                </select>

                <select
                  style={styles.sheetInput}
                  value={chargeSheet.taxType}
                  onChange={(e) =>
                    setChargeSheet({
                      ...chargeSheet,
                      taxType: e.target.value,
                    })
                  }
                >
                  <option value="without">Without Tax</option>
                  <option value="with">With Tax</option>
                </select>
              </>
            )}

            <button
              style={styles.sheetSaveBtn}
              onClick={
                chargeSheet.type === "discount" ? saveDiscount : saveCharge
              }
            >
              Save
            </button>
          </div>
        </div>
      )}

      {docSheet.open && (
        <div style={styles.sheetOverlay}>
          <div style={styles.sheet}>
            <div style={styles.sheetHeader}>
              <strong>Edit Document</strong>
              <span
                style={styles.sheetClose}
                onClick={() => setDocSheet({ open: false })}
              >
                ✕
              </span>
            </div>

            <label style={styles.label}>Prefix</label>
            <input
              style={styles.sheetInput}
              value={docSheet.prefix}
              onChange={(e) =>
                setDocSheet({ ...docSheet, prefix: e.target.value })
              }
            />

            <label style={styles.label}>Document Number</label>
            <input
              type="number"
              style={styles.sheetInput}
              value={docSheet.number}
              onChange={(e) =>
                setDocSheet({ ...docSheet, number: e.target.value })
              }
            />

            <label style={styles.label}>Document Date</label>
            <input
              type="date"
              style={styles.sheetInput}
              value={docSheet.date}
              onChange={(e) =>
                setDocSheet({ ...docSheet, date: e.target.value })
              }
            />

            <label style={styles.label}>Due Date</label>
            <input
              type="date"
              style={styles.sheetInput}
              value={docSheet.dueDate}
              onChange={(e) =>
                setDocSheet({ ...docSheet, dueDate: e.target.value })
              }
            />

            <button
              style={styles.sheetSaveBtn}
              onClick={() => {
                setQuotation((q) => ({
                  ...q,
                  document: {
                    ...q.document,
                    prefix: docSheet.prefix,
                    number: docSheet.number,
                    date: docSheet.date,
                    dueDate: docSheet.dueDate,
                  },
                }));

                setDocSheet({ open: false });
              }}
            >
              Save & Update
            </button>
          </div>
        </div>
      )}
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

function OptionalRow({ icon, label, value, onClick, action }) {
  const hasValue = value !== null && value !== undefined && value !== "";

  return (
    <div style={styles.optionalRow} onClick={onClick}>
      <div style={styles.optionalLeft}>
        <span style={styles.optionalIcon}>{icon}</span>

        <div>
          {/* LABEL */}
          <div style={styles.optionalLabel}>
            {hasValue ? label : `Add ${label}`}
          </div>

          {/* VALUE (only when exists) */}
          {hasValue && <div style={styles.optionalValue}>{value}</div>}
        </div>
      </div>

      {action && <span style={styles.link}>{action}</span>}
    </div>
  );
}

function Divider() {
  return <div style={styles.divider} />;
}

/* ================= STYLES ================= */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0e0e0e",
    color: "#fff",
    paddingBottom: "calc(180px + env(safe-area-inset-bottom))",
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
  createBtn: {
    background: "#5b7cfa",
    border: "none",
    padding: "8px 18px",
    color: "#fff",
    borderRadius: 10,
    fontSize: 14,
    cursor: "pointer",
  },
  selectCard: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 14,
    background: "#2a2a2a",
    cursor: "pointer",
  },

  plus: {
    fontSize: 22,
    color: "#5b7cfa",
  },

  selectText: {
    color: "#5b7cfa",
    fontSize: 16,
  },

  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#2a2a2a",
    padding: 14,
    borderRadius: 14,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: 600,
  },

  cardActions: {
    display: "flex",
    gap: 16,
  },

  editHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  editBtn: {
    color: "#5b7cfa",
    cursor: "pointer",
  },

  productCard: {
    display: "flex",
    justifyContent: "space-between",
    background: "#2a2a2a",
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
  },

  muted: {
    fontSize: 12,
    opacity: 0.6,
  },

  addMoreBtn: {
    marginTop: 12,
    padding: 12,
    borderRadius: 20,
    background: "#2a2a2a",
    textAlign: "center",
    cursor: "pointer",
  },
  optionalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    margin: "16px 12px 8px",
    opacity: 0.7,
  },

  addChargeBtn: {
    color: "#5b7cfa",
    cursor: "pointer",
  },

  optionalCard: {
    background: "#1c1c1c",
    margin: 12,
    borderRadius: 14,
    overflow: "hidden",
  },

  optionalRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 16px",
    borderBottom: "1px solid #2a2a2a",
    cursor: "pointer",
  },

  optionalLeft: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },

  optionalIcon: {
    fontSize: 18,
    opacity: 0.8,
  },

  optionalLabel: {
    fontSize: 14,
    opacity: 0.7,
  },

  optionalValue: {
    fontSize: 15,
    marginTop: 2,
  },

  divider: {
    height: 1,
    background: "#2a2a2a",
    margin: "6px 0",
  },
  sheetOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    zIndex: 999,
  },

  sheet: {
    width: "100%",
    background: "#1c1c1c",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },

  sheetHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  sheetClose: {
    fontSize: 20,
    cursor: "pointer",
  },

  sheetTextarea: {
    width: "100%",
    height: 160,
    background: "#111",
    color: "#fff",
    borderRadius: 12,
    padding: 12,
    border: "1px solid #333",
    resize: "none",
  },

  sheetSaveBtn: {
    width: "100%",
    marginTop: 16,
    padding: 14,
    background: "#5b7cfa",
    border: "none",
    borderRadius: 12,
    fontSize: 16,
    color: "#fff",
    cursor: "pointer",
  },
  toast: {
    position: "fixed",
    bottom: 90, // above total bar
    left: "50%",
    transform: "translateX(-50%)",
    background: "#323232",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: 20,
    fontSize: 14,
    zIndex: 1000,
    boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
    animation: "fadeInUp 0.3s ease",
  },
  toggleRow: {
    display: "flex",
    gap: 20,
    marginBottom: 12,
  },

  sheetInput: {
    width: "100%",
    padding: 12,
    marginTop: 10,
    background: "#111",
    border: "1px solid #333",
    borderRadius: 10,
    color: "#fff",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: 14,
    marginBottom: 4,
  },

  totalRowGreen: {
    display: "flex",
    justifyContent: "space-between",
    color: "#22c55e",
    fontSize: 14,
  },

  totalFooter: {
    marginTop: 12,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
  },

  totalBar: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    background: "linear-gradient(180deg, #0b1220, #0b1220)",
    padding: 16,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 -6px 20px rgba(0,0,0,0.4)",
  },
  label: {
    fontSize: 13,
    opacity: 0.7,
    marginTop: 10,
    display: "block",
  },
  quoteCard: {
    background: "#2a2a2a",
    margin: 12,
    padding: 16,
    borderRadius: 14,
  },

  quoteCardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  quoteLabel: {
    fontSize: 13,
    opacity: 0.6,
  },

  quoteNumber: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 4,
  },

  quoteDate: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 4,
  },

  gstRow: {
    display: "flex",
    gap: 24,
    marginTop: 16,
  },
};
