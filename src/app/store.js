import { configureStore } from "@reduxjs/toolkit";
import restaurantReducer from "../features/restaurant/restaurantSlice";
import cartReducer from "../features/usercart/cartSlice";
import userReducer from "../features/user/userSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        restaurant: restaurantReducer,
        cart: cartReducer,
    },
});

export default store;