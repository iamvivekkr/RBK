// src/pages/signatures/Signatures.jsx
import { useState } from "react";
import SignatureList from "./SignatureList";
import SignatureForm from "./SignatureForm";

export default function Signatures() {
  const [view, setView] = useState("list"); // list | form
  const [selectedSignature, setSelectedSignature] = useState(null);

  return (
    <>
      {view === "list" && (
        <SignatureList
          onAdd={() => {
            setSelectedSignature(null);
            setView("form");
          }}
          onEdit={(sig) => {
            setSelectedSignature(sig);
            setView("form");
          }}
        />
      )}

      {view === "form" && (
        <SignatureForm
          signature={selectedSignature}
          onBack={() => setView("list")}
        />
      )}
    </>
  );
}
