import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
// import { data } from "react-router-dom";

export const fetchUser = createAsyncThunk(
    "user/fetchUser",
    async (userId, thunkAPI) => {
        try {
            const token = localStorage.getItem("token");
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/profile/${userId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            return res.data.user;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState: {
        data: null,
        loading: false,
        error: null
    },

    reducers: {
        clearUser: (state) => {
            state.data = null;
            state.loading = false;
            state.error = null;
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch user";
            });
    },
});

export const { clearUser } = userSlice.actions;
export const selectUser = (state) => state.user.data;
export default userSlice.reducer;
