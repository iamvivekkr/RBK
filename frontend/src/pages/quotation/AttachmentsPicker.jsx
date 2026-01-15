import { useState } from "react";
import { ArrowLeft, Upload, Trash } from "lucide-react";

export default function AttachmentsPicker({ attachments = [], onDone }) {
  const [files, setFiles] = useState(attachments);

  /* ---------------- ADD FILE ---------------- */
  const addFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFiles([
      ...files,
      {
        id: Date.now(),
        name: file.name,
        file,
      },
    ]);

    e.target.value = null;
  };

  /* ---------------- REMOVE FILE ---------------- */
  const removeFile = (id) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  /* ---------------- UI ---------------- */
  return (
    <div style={styles.page}>
      {/* HEADER */}
      <div style={styles.header}>
        <ArrowLeft onClick={() => onDone(null)} style={{ cursor: "pointer" }} />
        <h3>Attachments</h3>
      </div>

      {/* UPLOAD */}
      <label style={styles.uploadBox}>
        <Upload size={22} />
        <span>Add Attachment</span>
        <input type="file" hidden onChange={addFile} />
      </label>

      {/* FILE LIST */}
      <div style={{ paddingBottom: 100 }}>
        {files.map((f) => (
          <div key={f.id} style={styles.fileRow}>
            <span style={styles.fileName}>{f.name}</span>
            <Trash
              size={18}
              style={{ cursor: "pointer", color: "#ff4d4f" }}
              onClick={() => removeFile(f.id)}
            />
          </div>
        ))}

        {files.length === 0 && (
          <div style={styles.empty}>No attachments added</div>
        )}
      </div>

      {/* SAVE */}
      <button style={styles.saveBtn} onClick={() => onDone(files)}>
        Done
      </button>
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
    gap: 12,
    padding: 16,
    background: "#2a2a2a",
    alignItems: "center",
  },
  uploadBox: {
    margin: 16,
    padding: 16,
    border: "1px dashed #555",
    borderRadius: 12,
    display: "flex",
    gap: 10,
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    opacity: 0.9,
  },
  fileRow: {
    margin: "8px 16px",
    padding: 12,
    background: "#1c1c1c",
    borderRadius: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  fileName: {
    fontSize: 14,
    opacity: 0.9,
  },
  empty: {
    textAlign: "center",
    padding: 40,
    opacity: 0.6,
  },
  saveBtn: {
    position: "fixed",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 18,
    background: "#4caf50",
    border: "none",
    color: "#fff",
    fontSize: 18,
    cursor: "pointer",
  },
};
