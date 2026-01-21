import { useState } from "react";
import DispatchAddressList from "./DispatchAddressList";
import DispatchAddressForm from "./DispatchAddressForm";

export default function DispatchAddress() {
  const [view, setView] = useState("list");
  const [selectedAddress, setSelectedAddress] = useState(null);

  return (
    <>
      {view === "list" && (
        <DispatchAddressList
          onAdd={() => {
            setSelectedAddress(null);
            setView("form");
          }}
          onEdit={(address) => {
            setSelectedAddress(address);
            setView("form");
          }}
        />
      )}

      {view === "form" && (
        <DispatchAddressForm
          address={selectedAddress}
          onBack={() => setView("list")}
        />
      )}
    </>
  );
}
