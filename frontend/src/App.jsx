import Home from "./pages/Home";
import Customers from "./pages/Customers";
import { Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import Banks from "./pages/banks/Banks";
import Signatures from "./pages/signatures/Signatures";
import Products from "./pages/products/Products";
import Quotation from "./pages/quotation/Quotation";
import DispatchAddress from "./pages/dispatch-address/DispatchAddress";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/signatures" element={<Signatures />} />
      <Route path="/banks" element={<Banks />} />
      <Route path="/products" element={<Products />} />
      <Route path="/quotation" element={<Quotation />} />
      <Route path="/dispatch-addresses" element={<DispatchAddress />} />
    </Routes>
  );
}

export default App;
