// src/pages/customers/CustomerForm.jsx
import { useEffect, useState } from "react";
import { ArrowLeft, Plus, X } from "lucide-react";
import API from "../services/api";

export default function CustomerForm({ customer, onBack }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    companyName: "",
    gst: "",
    billingAddress: {},
    shippingAddress: {},
  });

  const [showModal, setShowModal] = useState(false);
  const [addressType, setAddressType] = useState("");
  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    if (customer) setForm(customer);
  }, [customer]);

  const openModal = (type) => {
    setAddressType(type);
    setAddress(
      type === "Billing"
        ? form.billingAddress || {}
        : form.shippingAddress || {},
    );
    setShowModal(true);
  };

  const saveAddress = () => {
    setForm({
      ...form,
      [addressType === "Billing" ? "billingAddress" : "shippingAddress"]:
        address,
    });
    setShowModal(false);
  };

  const submit = async () => {
    if (customer?._id) {
      await API.put(`/customers/${customer._id}`, form);
    } else {
      await API.post("/customers", form);
    }

    onBack();
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <ArrowLeft onClick={onBack} style={{ cursor: "pointer" }} />
        <h3>{customer ? "Edit Customer" : "Add Customer"}</h3>
      </div>

      <div style={styles.card}>
        <Input
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Input
          label="Mobile"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <Input
          label="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <Input
          label="Company Name"
          value={form.companyName}
          onChange={(e) => setForm({ ...form, companyName: e.target.value })}
        />
        <Input
          label="GST Number"
          value={form.gst}
          onChange={(e) => setForm({ ...form, gst: e.target.value })}
        />

        <Section title="Billing Address">
          {Object.keys(form.billingAddress).length === 0 ? (
            <AddButton
              label="+ Billing Address"
              onClick={() => openModal("Billing")}
            />
          ) : (
            <AddressCard
              address={form.billingAddress}
              onEdit={() => openModal("Billing")}
              onDelete={() => setForm({ ...form, billingAddress: {} })}
            />
          )}
        </Section>

        <Section title="Shipping Address">
          {Object.keys(form.shippingAddress).length === 0 ? (
            <AddButton
              label="+ Shipping Address"
              onClick={() => openModal("Shipping")}
            />
          ) : (
            <AddressCard
              address={form.shippingAddress}
              onEdit={() => openModal("Shipping")}
              onDelete={() => setForm({ ...form, shippingAddress: {} })}
            />
          )}
        </Section>
      </div>

      <button style={styles.saveBtn} onClick={submit}>
        {customer ? "Update Customer" : "Add Customer"}
      </button>

      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <span>{addressType} Address</span>
              <X
                onClick={() => setShowModal(false)}
                style={{ cursor: "pointer" }}
              />
            </div>

            {["line1", "line2", "city", "state", "pincode"].map((f) => (
              <Input
                key={f}
                label={f.toUpperCase()}
                value={address[f] || ""}
                onChange={(e) =>
                  setAddress({ ...address, [f]: e.target.value })
                }
              />
            ))}

            <button style={styles.modalBtn} onClick={saveAddress}>
              Save Address
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- Small Components ---------- */
const Input = ({ label, value, onChange }) => (
  <div style={{ marginBottom: 12 }}>
    <label style={styles.label}>{label}</label>
    <input value={value} onChange={onChange} style={styles.input} />
  </div>
);

const Section = ({ title, children }) => (
  <div style={{ marginTop: 16 }}>
    <strong>{title}</strong>
    {children}
  </div>
);

const AddButton = ({ label, onClick }) => (
  <div style={styles.addBtn} onClick={onClick}>
    <Plus size={16} /> {label}
  </div>
);

const AddressCard = ({ address, onEdit, onDelete }) => (
  <div style={styles.addressCard}>
    <div>
      <p>{address.line1}</p>
      <small>
        {address.city}, {address.state} - {address.pincode}
      </small>
    </div>
    <div>
      <span style={styles.edit} onClick={onEdit}>
        Edit
      </span>{" "}
      <span style={styles.delete} onClick={onDelete}>
        Delete
      </span>
    </div>
  </div>
);

/* ---------- Styles ---------- */
const styles = {
  page: {
    minHeight: "100vh",
    background: "#0e0e0e",
    color: "#fff",
    paddingBottom: 100,
  },
  header: { display: "flex", gap: 12, padding: 16 },
  card: { background: "#1c1c1c", margin: 16, padding: 16, borderRadius: 16 },
  input: {
    width: "100%",
    padding: 14,
    borderRadius: 10,
    background: "#2a2a2a",
    border: "1px solid #444",
    color: "#fff",
  },
  label: { fontSize: 13, opacity: 0.7 },
  addBtn: { padding: 12, cursor: "pointer" },
  saveBtn: {
    position: "fixed",
    bottom: 16,
    left: 16,
    right: 16,
    padding: 16,
    background: "#55b6a2",
    border: "none",
    borderRadius: 14,
    cursor: "pointer",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "flex-end",
  },
  modal: {
    background: "#1c1c1c",
    width: "100%",
    padding: 16,
    borderRadius: "20px 20px 0 0",
  },
  modalHeader: { display: "flex", justifyContent: "space-between" },
  modalBtn: {
    width: "100%",
    padding: 14,
    marginTop: 8,
    background: "#55b6a2",
    border: "none",
  },
  addressCard: {
    background: "#2a2a2a",
    padding: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  edit: { color: "#55b6a2", cursor: "pointer" },
  delete: { color: "#ff4d4f", cursor: "pointer" },
};
