// src/pages/customers/Customers.jsx
import { useState } from "react";
import CustomerList from "./CustomerList";
import CustomerForm from "./CustomerForm";

export default function Customers() {
  const [view, setView] = useState("list"); // list | form
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  return (
    <>
      {view === "list" && (
        <CustomerList
          onAdd={() => {
            setSelectedCustomer(null);
            setView("form");
          }}
          onEdit={(customer) => {
            setSelectedCustomer(customer);
            setView("form");
          }}
        />
      )}

      {view === "form" && (
        <CustomerForm
          customer={selectedCustomer}
          onBack={() => setView("list")}
        />
      )}
    </>
  );
}
