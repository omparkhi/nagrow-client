import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import  axios from "axios";

export const fetchOrder = createAsyncThunk(
    "order/fetchOrder",   
    async(restaurantId, thunkAPI) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/get/orders/${restaurantId}`);
            return res.data.order;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const fetchOrderById = createAsyncThunk(
    "order/fetchOrderById",
    async(orderId, thunkAPI) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/order/details/${orderId}`);
            return res.data.order;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const updateOrderStatus = createAsyncThunk(
    "order/updateOrderStatus",
    async({ id, status }, thunkAPI) => {
        try {
            const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/get/orders/update-status`, 
                {id, status}
            );
            return res.data.order;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
)

export const fetchUserOrderById = createAsyncThunk(
    "order/fetchUserOrderById",
    async(orderId , thunkAPI) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/order/${orderId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            return res.data.order;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response?.data || err.message);
        }
    }
);





const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        list: [],
        currentOrder: null,
        loading: false,
        error: null,
    },

    extraReducers: (builder) => {
        builder
            .addCase(fetchOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrder.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // 'fetch order by id'
            .addCase(fetchOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentOrder = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // update order status
            .addCase(updateOrderStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;

                const index = state.list.findIndex((order) => order._id === updated._id);
                if(index !== -1) {
                    state.list[index] = updated;
                }

                if(state.currentOrder && state.currentOrder._id === updated._id) {
                    state.currentOrder = updated;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // fetch user order by id 
            .addCase(fetchUserOrderById.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.currentOrder = null;
            })
            .addCase(fetchUserOrderById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentOrder = action.payload;
            })
            .addCase(fetchUserOrderById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
    
});


export default orderSlice.reducer;