import { useState } from "react";
import BankList from "./BankList";
import BankForm from "./BankForm";

export default function Banks() {
  const [view, setView] = useState("list"); // list | form
  const [selectedBank, setSelectedBank] = useState(null);

  return (
    <>
      {view === "list" && (
        <BankList
          onAdd={() => {
            setSelectedBank(null);
            setView("form");
          }}
          onEdit={(bank) => {
            setSelectedBank(bank);
            setView("form");
          }}
        />
      )}

      {view === "form" && (
        <BankForm bank={selectedBank} onBack={() => setView("list")} />
      )}
    </>
  );
}
