import { ArrowLeft, Plus, ImagePlus, X, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { saveCompany, uploadLogo, getCompany } from "../services/companyApi";

export default function Profile() {
  const navigate = useNavigate();

  /* ---------------- STATE ---------------- */
  const [logo, setLogo] = useState(null);
  const [preview, setPreview] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");

  const [company, setCompany] = useState({
    name: "",
    gst: "",
    phone: "",
    email: "",
    tradeName: "",
    pan: "",
    alternatePhone: "",
    website: "",
    billingAddress: {},
    shippingAddress: {},
    logo: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [addressType, setAddressType] = useState("");
  const [address, setAddress] = useState({
    line1: "",
    line2: "",
    pincode: "",
    city: "",
    state: "",
  });

  /* ---------------- LOAD COMPANY ---------------- */
  useEffect(() => {
    getCompany().then((res) => {
      if (res?.data) {
        setCompany(res.data);
        if (res.data.logo) {
          setPreview(`${import.meta.env.VITE_API_URL}${res.data.logo}`);
        }
      }
    });
  }, []);

  /* ---------------- AUTO HIDE MESSAGE ---------------- */
  useEffect(() => {
    if (!saveMessage) return;
    const t = setTimeout(() => setSaveMessage(""), 2500);
    return () => clearTimeout(t);
  }, [saveMessage]);

  /* ---------------- HANDLERS ---------------- */
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLogo(file);
    setPreview(URL.createObjectURL(file));
  };

  const openModal = (type) => {
    setAddressType(type);
    setAddress(
      type === "Billing"
        ? company.billingAddress || {}
        : company.shippingAddress || {},
    );
    setShowModal(true);
  };

  const saveAddress = () => {
    setCompany((prev) => ({
      ...prev,
      [addressType === "Billing" ? "billingAddress" : "shippingAddress"]:
        address,
    }));
    setShowModal(false);
  };

  const handleSaveProfile = async () => {
    if (!company.name || !company.phone || !company.email) {
      setSaveMessage("Company Name, Phone and Email are required ❌");
      return;
    }

    try {
      setSaveMessage("Saving...");

      let updatedCompany = { ...company };

      if (logo) {
        const res = await uploadLogo(logo);
        if (!res?.data?.logo) throw new Error("Logo upload failed");
        updatedCompany.logo = res.data.logo;
      }

      await saveCompany(updatedCompany);
      setCompany(updatedCompany);
      setLogo(null);

      setSaveMessage("Profile saved successfully ✅");
    } catch (err) {
      console.error(err);
      setSaveMessage(err.response?.data?.message || "Error saving profile ❌");
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <ArrowLeft onClick={() => navigate(-1)} style={{ cursor: "pointer" }} />
        <span>Company Details</span>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          {/* LOGO */}
          <label style={styles.logoBox}>
            {preview ? (
              <img src={preview} alt="logo" style={styles.logoImg} />
            ) : (
              <ImagePlus size={34} />
            )}
            <div style={styles.editOverlay}>
              <Pencil size={16} />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              style={{ display: "none" }}
            />
          </label>

          <p style={styles.logoText}>Upload Company Logo</p>

          <FieldsetInput
            label="Company Name"
            value={company.name}
            onChange={(e) => setCompany({ ...company, name: e.target.value })}
          />
          <FieldsetInput
            label="GST Number"
            value={company.gst}
            onChange={(e) => setCompany({ ...company, gst: e.target.value })}
          />
          <FieldsetInput
            label="Business Phone No."
            value={company.phone}
            onChange={(e) => setCompany({ ...company, phone: e.target.value })}
          />
          <FieldsetInput
            label="Email Address"
            value={company.email}
            onChange={(e) => setCompany({ ...company, email: e.target.value })}
          />
          <FieldsetInput
            label="Trade/Brand Name"
            value={company.tradeName}
            onChange={(e) =>
              setCompany({ ...company, tradeName: e.target.value })
            }
          />
        </div>

        <Section title="Billing Address">
          <AddressCard
            type="Billing"
            address={company.billingAddress}
            onEdit={() => openModal("Billing")}
            onDelete={() => setCompany({ ...company, billingAddress: {} })}
          />
        </Section>

        <Section title="Shipping Address">
          <AddressCard
            type="Shipping"
            address={company.shippingAddress}
            onEdit={() => openModal("Shipping")}
            onDelete={() => setCompany({ ...company, shippingAddress: {} })}
          />
        </Section>

        <Section title="Optional Fields">
          <FieldsetInput
            label="PAN"
            value={company.pan}
            onChange={(e) => setCompany({ ...company, pan: e.target.value })}
          />
          <FieldsetInput
            label="Alternate Contact Number"
            value={company.alternatePhone}
            onChange={(e) =>
              setCompany({ ...company, alternatePhone: e.target.value })
            }
          />
          <FieldsetInput
            label="Website"
            value={company.website}
            onChange={(e) =>
              setCompany({ ...company, website: e.target.value })
            }
          />
        </Section>
      </div>

      {saveMessage && <div style={styles.saveMessage}>{saveMessage}</div>}

      <button style={styles.saveBtn} onClick={handleSaveProfile}>
        Save & Update
      </button>

      {/* ADDRESS MODAL */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <div style={styles.modalHeader}>
              <span>Enter {addressType} Address</span>
              <X
                onClick={() => setShowModal(false)}
                style={{ cursor: "pointer" }}
              />
            </div>

            <div style={styles.modalContent}>
              {["line1", "line2", "pincode", "city", "state"].map((f) => (
                <FieldsetInput
                  key={f}
                  label={f.toUpperCase()}
                  value={address[f] || ""}
                  onChange={(e) =>
                    setAddress({ ...address, [f]: e.target.value })
                  }
                />
              ))}
            </div>

            <button style={styles.modalBtn} onClick={saveAddress}>
              Save Address
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

const FieldsetInput = ({ label, value, onChange }) => (
  <fieldset style={styles.fieldset}>
    <legend style={styles.legend}>{label}</legend>
    <input value={value} onChange={onChange} style={styles.fieldsetInput} />
  </fieldset>
);

const Section = ({ title, children }) => (
  <>
    <h4 style={styles.sectionTitle}>{title}</h4>
    <div style={styles.sectionBox}>{children}</div>
  </>
);

const AddButton = ({ label, onClick }) => (
  <div style={styles.addBtn} onClick={onClick}>
    <Plus size={16} /> <span>{label}</span>
  </div>
);

const AddressCard = ({ type, address, onEdit, onDelete }) => {
  if (!address || Object.keys(address).length === 0) {
    return <AddButton label={`+ ${type} Address`} onClick={onEdit} />;
  }
  return (
    <div style={styles.addressCard}>
      <div>
        <strong>{type} Address</strong>
        <p>{address.line1}</p>
        <p>
          {address.city}, {address.state} - {address.pincode}
        </p>
      </div>
      <div style={styles.addressActions}>
        <span style={styles.editBtn} onClick={onEdit}>
          Edit
        </span>
        <span style={styles.deleteBtn} onClick={onDelete}>
          Delete
        </span>
      </div>
    </div>
  );
};

/* ---------------- STYLES ---------------- */
const styles = {
  page: { minHeight: "100vh", background: "#0e0e0e", color: "#fff" },
  content: { paddingBottom: 100 },
  header: { display: "flex", gap: 12, padding: 16, fontSize: 18 },
  card: { background: "#1c1c1c", margin: 16, padding: 16, borderRadius: 16 },
  logoBox: {
    position: "relative",
    width: 80,
    height: 80,
    borderRadius: 16,
    background: "#f0f0f0",
    margin: "auto",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoImg: { width: "100%", height: "100%", objectFit: "cover" },
  editOverlay: {
    position: "absolute",
    bottom: 6,
    right: 6,
    background: "rgba(0,0,0,0.6)",
    borderRadius: "50%",
    padding: 6,
  },
  logoText: { textAlign: "center", fontSize: 13, opacity: 0.7, margin: 10 },
  fieldset: { border: "1px solid #444", borderRadius: 8, marginBottom: 12 },
  legend: { color: "#aaa", fontSize: 12 },
  fieldsetInput: {
    width: "100%",
    background: "transparent",
    border: "none",
    outline: "none",
    color: "#fff",
    padding: 8,
  },
  sectionTitle: { margin: "20px 16px 8px", opacity: 0.7 },
  sectionBox: { background: "#1c1c1c", margin: "0 16px", borderRadius: 14 },
  addBtn: { display: "flex", gap: 8, padding: 12, cursor: "pointer" },
  saveBtn: {
    position: "fixed",
    bottom: 16,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 14,
    background: "#55b6a2",
    border: "none",
    color: "#fff",
    fontSize: 16,
    cursor: "pointer",
  },
  saveMessage: {
    position: "fixed",
    bottom: 80,
    left: 16,
    right: 16,
    background: "#1c1c1c",
    padding: 12,
    textAlign: "center",
    color: "#55b6a2",
    borderRadius: 12,
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
  },
  modal: {
    width: "100%",
    background: "#1c1c1c",
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalHeader: { display: "flex", justifyContent: "space-between" },
  modalContent: { maxHeight: "60vh", overflowY: "auto" },
  modalBtn: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    background: "#55b6a2",
    border: "none",
    color: "#fff",
  },
  addressCard: {
    background: "#2a2a2a",
    padding: 12,
    borderRadius: 10,
    margin: "8px 0",
    display: "flex",
    justifyContent: "space-between",
  },
  addressActions: { display: "flex", gap: 8 },
  editBtn: { color: "#55b6a2", cursor: "pointer" },
  deleteBtn: { color: "#ff4d4f", cursor: "pointer" },
};
