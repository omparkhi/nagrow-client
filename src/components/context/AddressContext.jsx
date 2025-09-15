import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAddress = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:3000/api/users/get-address",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.data.success) {
        setAddresses(res.data.addresses);
        setError(null);
      } else {
        setError("Failed to fetch addresses");
      }
    } catch (err) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch addresses once when context loads
  useEffect(() => {
    fetchAddress();
  }, []);

  return (
    <AddressContext.Provider
      value={{ addresses, loading, error, fetchAddress }}
    >
      {children}
    </AddressContext.Provider>
  );
};

// Custom hook for easier consumption
export const useAddress = () => useContext(AddressContext);
