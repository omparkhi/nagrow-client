import React, { useContext, createContext, useEffect, useState, useCallback } from "react";
import { addressService } from "../services/address.service";
import { toast } from "react-toastify";

const AddressContext = createContext();

export const AddressProvider = ({ children }) => {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const fetchAddresses = useCallback(async () => {
        setLoading(true);
        try {
            const data = await addressService.getAddresses();
            if(data && data.success) {
                setAddresses(data.addresses || []);
                const sel = (data.addresses || []).find((a) => a.selectedAddress) || data.addresses?.[0] || null;
                setSelectedAddress(sel);
                setError(null);
            } else {
                setAddresses([]);
                setSelectedAddress(null);
                setError(data?.message || "Failed to fetch addresses");
            }
        } catch (err) {
            setAddresses([]);
            setSelectedAddress(null);
            setError(err?.message || "Failed to fetch addresses");
            console.log("fetchAddresses error", err);
        } finally {
            setLoading(false);
        }
    }, []);

    const selectAddress = useCallback(async (addressId) => {
        try {
            setLoading(true);
            const data = await addressService.selectAddress(addressId);
            if(data?.success) {
                setAddresses(data.addresses || []);
                const sel = (data.addresses || []).find((a) => a.selectedAddress) || null;
                setSelectedAddress(sel);
                toast.success(data.message || "Address selected");
                setError(null);
            } else {
                toast.error(data?.message || "Failed to select address");
            }
        } catch (err) {
            console.log("selectAddress error", err);
            toast.error("Failed to select address");
        } finally {
            setLoading(false);
        }
    }, []);

    const saveAddress = useCallback( async (payload) => {
        try {
            setLoading(true);
            const data = await addressService.saveAddress(payload);
            if(data?.success) {
                const saved = data.address;
                setAddresses((prev) => {
                    const idx = prev.findIndex((a) => a._id === (payload.addressId || saved._id));
                    if(idx >= 0) {
                        const copy = [...prev];
                        copy[idx] = saved;
                        return copy;
                    } else {
                        return [saved, ...prev];
                    }
                });
                toast.success(data.message || "Address saved");

                setSelectedAddress((cur) => cur || saved);
                setError(null);
                return { success: true, saved };
            } else {
                toast.error(data?.message || "Save failed");
                return { success: false };
            }
        } catch (err) {
            console.log("saveAddress error", err);
            toast.error(err?.response?.data?.message || "Failed to save address");
            return { success: false };
        } finally {
            setLoading(false);
        }
    }, []);

    const updateAddress = useCallback(async (addressId, payload) => {
        try {
            setLoading(true);
            const data = await addressService.updateAddress(addressId, payload);
            if(data?.success) {
                setAddresses(data.addresses);
                const sel = (data.addresses || []).find((a) => a.selectedAddress) || null;
                setSelectedAddress(sel);
                toast.success(data.message || "Address updated");
                setError(null);
                return { success: true };
            } else {
                toast.error(data?.message || "Update failed");
                return { success: false };
            }

        } catch (err) {
            console.log("updateAddress error", err);
            toast.error("Failed to update address");
            return { success: false };
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteAddress = useCallback(async (addressId) => {
        try {
            setLoading(true);
            const data = await addressService.deleteAddress(addressId);
            if(data?.success) {
                setAddresses(data.addresses || []);
                const sel = (data.addresses || []).find((a) => a.selectedAddress) || data.addresses?.[0] || null;
                setSelectedAddress(sel);
                toast.success(data.message || "Address deleted");
                setError(null);
                return { success: true };
            } else {
                toast.error(data?.message || "Delete failed");
                return { success: false };
            }
        } catch (err) {
            console.log("deleteAddress error", err);
            toast.error("Failed to delete address");
            return { success: false };
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    const value = {
    addresses,
    selectedAddress,
    loading,
    error,
    fetchAddresses,
    selectAddress,
    saveAddress,
    updateAddress,
    deleteAddress,
  };

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
};

export const useAddress = () => useContext(AddressContext);