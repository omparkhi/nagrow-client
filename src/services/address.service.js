import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

function authHeader() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export const addressService  = {
    async getAddresses() {
        const res = await axios.get(`${API_BASE}/api/users/get-address`, {
            headers: { ...authHeader() },
        });
        return res.data;
    },

    async selectAddress(addressId) {
        const res = await axios.get(`${API_BASE}/api/users/get-address?addressId=${addressId}`, {
            headers: { ...authHeader() },
        });
        return res.data;
    },

    async saveAddress(payload) {
        const res = await axios.post(`${API_BASE}/api/users/save-address`, payload, {
            headers: { ...authHeader() },
        });
        return res.data;
    },

    async updateAddress(addressId, payload) {
        const res = await axios.put(`${API_BASE}/api/users/update-address/${addressId}`, payload, {
            headers: { ...authHeader() },
        });
        return res.data;
    },

    async deleteAddress(addressId) {
        const res = await axios.delete(`${API_BASE}/api/users/delete-address/${addressId}`, {
            headers: { ...authHeader() },
        });
        return res.data;
    },

};
