// src/pages/banks/BankForm.jsx
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import API from "../../services/api";

export default function BankForm({ bank, onBack }) {
  const [form, setForm] = useState({
    ifsc: "",
    bankName: "",
    accountNumber: "",
    confirmAccount: "",
    branch: "",
    upi: "",
    openingBalance: "",
    gpay: "",
    notes: "",
    isDefault: true,
  });

  useEffect(() => {
    if (bank) {
      setForm({ ...bank, confirmAccount: bank.accountNumber });
    }
  }, [bank]);

  const submit = async () => {
    if (
      !form.ifsc ||
      !form.bankName ||
      !form.accountNumber ||
      form.accountNumber !== form.confirmAccount
    ) {
      alert("Please fill required fields correctly");
      return;
    }

    if (bank?._id) {
      await API.put(`/banks/${bank._id}`, form);
    } else {
      await API.post("/banks", form);
    }

    onBack();
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <ArrowLeft onClick={onBack} style={{ cursor: "pointer" }} />
        <h3>{bank ? "Edit Bank Detail" : "Add New Bank Detail"}</h3>
      </div>

      <div style={styles.card}>
        {input("Bank IFSC*", "ifsc")}
        {input("Bank name*", "bankName")}
        {input("Bank account no.*", "accountNumber")}
        {input("Confirm Bank account no.*", "confirmAccount")}
        {input("Bank branch name*", "branch")}
        {input("UPI (Optional)", "upi")}
        {input("Opening balance (Optional)", "openingBalance")}
        {input("GPay / PhonePe number", "gpay")}
        {input("Notes", "notes")}

        <div style={styles.toggle}>
          <span>Default</span>
          <input
            type="checkbox"
            checked={form.isDefault}
            onChange={() => setForm({ ...form, isDefault: !form.isDefault })}
          />
        </div>
      </div>

      <button style={styles.submitBtn} onClick={submit}>
        {bank ? "Update Bank" : "Add New Bank"}
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
    display: "block",
    marginTop: 12,
    marginBottom: 6,
    fontSize: 13,
    opacity: 0.8,
  },
  input: {
    width: "100%",
    background: "#2a2a2a",
    border: "1px solid #444",
    borderRadius: 10,
    padding: 14,
    color: "#fff",
  },
  toggle: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  submitBtn: {
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
};
