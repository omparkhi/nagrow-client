import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "nagrow_cart_v1";

const defaultCart = { restaurantId: null, restaurantName: null, items: [], tip: 0 };
const loadCart = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : defaultCart;
    } catch (err) {
        console.log("failed to load cart", err);
        return defaultCart;
    }
};

const saveCart = (state) => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
        console.log("failed to save cart", err);
    }
};


const initialState = loadCart();

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        setRestaurant(state, action) {
            state.restaurantId = action.payload.restaurantId;
            state.restaurantName = action.payload.restaurantName;
            saveCart(state);
        },

        addOrUpdateItem(state, action) {
            const item = action.payload;
            const found = state.items.find((i) => i.id === item.id);
            if(found) {
                found.quantity += item.quantity;
            } else {
                state.items.push(item);
            }
            saveCart(state);
        },

        increment(state, action) {
            const item = state.items.find((i) => i.id === action.payload);
            if(item) {
                item.quantity += 1;
            }
            saveCart(state);
        },

        decrement(state, action) {
            const item = state.items.find((i) => i.id === action.payload);
            if(item) {
                item.quantity -= 1;
                if(item.quantity <= 0) {
                    state.items = state.items.filter((i) => i.id !== action.payload);
                }
            }
            saveCart(state);
        },

        removeItem(state, action) {
            state.items = state.items.filter((i) => i.id !== action.payload);
            saveCart(state);
        },
         
        clearCart(state) {
            state.restaurantId = null;
            state.restaurantName = null;
            state.items = [];
            state.tip = 0;
            saveCart(state);    
        },

        setTip(state, action) {
            state.tip = action.payload;
            saveCart(state);
        },
    },
});

// selectors
export const getCart = (state) => state.cart;
export const getItems = (state) => state.cart.items;
export const getRestaurant = (state) => ({
    id: state.cart.restaurantId,
    name: state.cart.restaurantName,
});

export const getTotalItems = (state) => 
    state.cart.items.reduce((sum , i) => sum + i.quantity, 0);

export const getSubtotal = (state) => 
    state.cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

export const getDeliveryFee = (_, distanceKm = 0) => 
    Math.ceil(distanceKm * 12);


export const getGrandTotal = (state, distancekm = 0) => {
    const subtotal = getSubtotal(state);
    const delivery = getDeliveryFee(state, distancekm);
    const tip = Number(state.cart.tip) || 0;
    return subtotal + delivery + tip;
};

// helpers

export const addToCartThunk = (menuItem, restaurant) => (dispatch, getState) => {
    const state = getState().cart;
    if(state.restaurantId && state.restaurantId !== restaurant._id) {
        return {
            success: false,
            conflict: true,
            currentRestaurant: state.restaurantName,
        };
    }

    const payload = {
        id: menuItem._id,
        name: menuItem.name,
        price :menuItem.price,
        image: menuItem.image || "",
        quantity: 1,
    };

    dispatch(cartSlice.actions.addOrUpdateItem(payload));

    if(!state.restaurantId) {
        dispatch(
            cartSlice.actions.setRestaurant({
                restaurantId: restaurant._id,
                restaurantName: restaurant.name,
            })
        );
    }

    return { success: true };
};

export const {
    setRestaurant,
    addOrUpdateItem,
    increment,
    decrement,
    removeItem,
    clearCart,
    setTip,
} = cartSlice.actions;

export default cartSlice.reducer;