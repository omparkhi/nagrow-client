import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./app/store.js"
import { AddressProvider } from "./components/context/AddressContext";
// import { CartProvider } from "./components/context/CartContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AddressProvider>
          <App />
      </AddressProvider>
    </Provider>
  </StrictMode>
);
