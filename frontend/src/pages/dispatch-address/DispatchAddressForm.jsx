import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import API from "../../services/api";

export default function DispatchAddressForm({ address, onBack }) {
  const [form, setForm] = useState({
    addressLine1: "",
    addressLine2: "",
    pincode: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    if (address) {
      setForm({
        addressLine1: address.addressLine1 || "",
        addressLine2: address.addressLine2 || "",
        pincode: address.pincode || "",
        city: address.city || "",
        state: address.state || "",
      });
    }
  }, [address]);

  const submit = async () => {
    if (!form.addressLine1 || !form.pincode) {
      alert("Address line 1 and pincode required");
      return;
    }

    if (address?._id) {
      await API.put(`/dispatch-addresses/${address._id}`, form);
    } else {
      await API.post("/dispatch-addresses", form);
    }

    onBack();
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <ArrowLeft onClick={onBack} style={{ cursor: "pointer" }} />
        <h3>{address ? "Edit Address" : "Add Address"}</h3>
      </div>

      <div style={styles.card}>
        {input("Address Line 1", "addressLine1")}
        {input("Address Line 2", "addressLine2")}
        {input("Pincode", "pincode")}
        {input("City", "city")}
        {input("State", "state")}
      </div>

      <button style={styles.submitBtn} onClick={submit}>
        {address ? "Update Address" : "Save Address"}
      </button>
    </div>
  );

  function input(label, key) {
    return (
      <>
        <label style={styles.label}>{label}</label>
        <input
          style={styles.input}
          value={form[key]}
          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
        />
      </>
    );
  }
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0e0e0e",
    color: "#fff",
    paddingBottom: 100,
  },
  header: {
    display: "flex",
    gap: 12,
    padding: 16,
    alignItems: "center",
    background: "#2a2a2a",
  },
  card: {
    background: "#1c1c1c",
    margin: 16,
    padding: 16,
    borderRadius: 16,
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
    display: "block",
    opacity: 0.8,
  },
  input: {
    width: "100%",
    padding: 14,
    borderRadius: 10,
    border: "1px solid #444",
    background: "#2a2a2a",
    color: "#fff",
  },
  submitBtn: {
    position: "fixed",
    bottom: 16,
    left: 16,
    right: 16,
    padding: 16,
    borderRadius: 14,
    background: "#5b7cfa",
    border: "none",
    color: "#fff",
    fontSize: 16,
    cursor: "pointer",
  },
};
