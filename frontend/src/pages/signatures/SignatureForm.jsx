// src/pages/signatures/SignatureForm.jsx
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import API from "../../services/api";
const API_URL = import.meta.env.VITE_API_URL;

export default function SignatureForm({ signature, onBack }) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [name, setName] = useState("");
  const [isDefault, setIsDefault] = useState(true);

  useEffect(() => {
    if (signature) {
      setName(signature.name);
      setPreview(signature.image);
      setIsDefault(signature.isDefault);
    }
  }, [signature]);

  const submit = async () => {
    if (!name || !preview) {
      alert("Signature and name are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("isDefault", isDefault);
    if (image) formData.append("image", image);

    if (signature?._id) {
      await API.put(`/signatures/${signature._id}`, formData);
    } else {
      await API.post("/signatures", formData);
    }

    onBack();
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <ArrowLeft onClick={onBack} style={{ cursor: "pointer" }} />
        <h3>{signature ? "Edit Signature" : "Add Signature"}</h3>
      </div>

      <div style={styles.card}>
        {/* Upload */}
        <label style={styles.uploadBox}>
          {preview ? (
            <img
              src={
                preview.startsWith("blob:") ? preview : `${API_URL}${preview}`
              }
              alt="preview"
              style={styles.preview}
            />
          ) : (
            <span>Upload your signature</span>
          )}

          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => {
              setImage(e.target.files[0]);
              setPreview(URL.createObjectURL(e.target.files[0]));
            }}
          />
        </label>

        <small>You can change image by tapping on image*</small>

        {/* Name */}
        <label style={styles.label}>Signature name *</label>
        <input
          style={styles.input}
          placeholder="Please enter signature name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Default */}
        <div style={styles.toggle}>
          <span>Default</span>
          <input
            type="checkbox"
            checked={isDefault}
            onChange={() => setIsDefault(!isDefault)}
          />
        </div>

        {/* Instructions */}
        <div style={styles.info}>
          <p>1. Grab a white paper and sign it.</p>
          <p>2. Click "Upload signature".</p>
          <p>3. Choose Camera or Gallery.</p>
        </div>
      </div>

      <button style={styles.submitBtn} onClick={submit}>
        {signature ? "Update Signature" : "Add Signature"}
      </button>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0e0e0e",
    color: "#fff",
    paddingBottom: 80,
  },
  header: { display: "flex", gap: 12, padding: 16, background: "#2a2a2a" },
  card: { margin: 16, padding: 16, background: "#1c1c1c", borderRadius: 14 },
  uploadBox: {
    height: 200,
    background: "#fff",
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    marginBottom: 12,
  },
  preview: { maxHeight: "100%", maxWidth: "100%" },
  label: { marginTop: 12, display: "block" },
  input: {
    width: "100%",
    padding: 14,
    marginTop: 6,
    background: "#2a2a2a",
    border: "1px solid #444",
    color: "#fff",
    borderRadius: 10,
  },
  toggle: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 16,
  },
  info: { marginTop: 16, fontSize: 13, opacity: 0.7 },
  submitBtn: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 18,
    background: "#5b7cfa",
    border: "none",
    color: "#fff",
    fontSize: 18,
    cursor: "pointer",
  },
};
