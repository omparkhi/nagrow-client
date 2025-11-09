import { createSlice, createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchRestaurantAddress = createAsyncThunk(
    "restaurant/fetchAddress",
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/restaurants/get-address`,
                {
                headers: { Authorization: `Bearer ${token}` },
                }
            );
            return res.data.restaurant;
        } catch (err) {
            return rejectWithValue(
                err.response?.data?.message || "Failed to fetch restaurant address"
            );
        }
    }
);

const restaurantSlice = createSlice({
    name: "restaurant",
    initialState: {
        restaurant: null,
        loading: false,
        error: null
    },

    reducers: {
        clearRestaurant: (state) => {
            state.restaurant = false;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchRestaurantAddress.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRestaurantAddress.fulfilled, (state, action) => {
                state.loading = false;
                state.restaurant = action.payload;
            })
            .addCase(fetchRestaurantAddress.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearRestaurant } = restaurantSlice.actions;
export default restaurantSlice.reducer;