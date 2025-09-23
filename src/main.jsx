import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AddressProvider } from "./components/context/AddressContext";
import { CartProvider } from "./components/context/CartContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AddressProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AddressProvider>
  </StrictMode>
);
