import { useState } from "react";
import ProductList from "./ProductList";
import ProductForm from "./ProductForm";

export default function Products() {
  const [view, setView] = useState("list");
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <>
      {view === "list" && (
        <ProductList
          onAdd={() => {
            setSelectedProduct(null);
            setView("form");
          }}
          onEdit={(product) => {
            setSelectedProduct(product);
            setView("form");
          }}
        />
      )}

      {view === "form" && (
        <ProductForm product={selectedProduct} onBack={() => setView("list")} />
      )}
    </>
  );
}
