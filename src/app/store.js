import { configureStore } from "@reduxjs/toolkit";
import restaurantReducer from "../features/restaurant/restaurantSlice";
import OrderReducer from "../features/restaurant/orderSlice"
import cartReducer from "../features/usercart/cartSlice";
import userReducer from "../features/user/userSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        restaurant: restaurantReducer,
        orders: OrderReducer,
        cart: cartReducer,
    },
});

export default store;