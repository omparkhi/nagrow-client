import React, { createContext, useContext, useReducer, useEffect } from "react";

const CartContext = createContext();

const STORAGE_KEY = "nagrow_cart_v1";

const initialState = {
  restaurantId: null,
  restaurantName: null,
  items: [], // { id, name, price, image, quantity }
};

function reducer(state, action) {
  switch (action.type) {
    case "INIT":
      return action.payload;
    case "SET_RESTAURANT":
      return {
        ...state,
        restaurantId: action.payload.restaurantId,
        restaurantName: action.payload.restaurantName,
      };
    case "ADD_OR_UPDATE_ITEM": {
      const item = action.payload;
      const found = state.items.find((i) => i.id === item.id);
      if (found) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
          ),
        };
      }
      return { ...state, items: [...state.items, item] };
    }
    case "INCREMENT": {
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.payload ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    }
    case "DECREMENT": {
      return {
        ...state,
        items: state.items
          .map((i) =>
            i.id === action.payload ? { ...i, quantity: i.quantity - 1 } : i
          )
          .filter((i) => i.quantity > 0),
      };
    }
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.payload) };
    case "CLEAR_CART":
      return { restaurantId: null, restaurantName: null, items: [] };
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // init from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) dispatch({ type: "INIT", payload: JSON.parse(raw) });
    } catch (error) {
      console.error("Failed to read cart from localStorage", error);
    }
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // helpers
  const addToCart = (menuItem, restaurant) => {
    if (state.restaurantId && state.restaurantId !== restaurant._id) {
      return {
        success: false,
        conflict: true,
        currentRestaurant: state.restaurantName,
      };
    }

    const payload = {
      id: menuItem._id,
      name: menuItem.name,
      price: menuItem.price,
      image: menuItem.image || "",
      quantity: 1,
    };
    dispatch({ type: "ADD_OR_UPDATE_ITEM", payload });

    if (!state.restaurantId) {
      dispatch({
        type: "SET_RESTAURANT",
        payload: { restaurantId: restaurant._id, restaurantName: restaurant.name },
      });
    }
    return { success: true };
  };

  const increment = (itemId) => dispatch({ type: "INCREMENT", payload: itemId });
  const decrement = (itemId) => dispatch({ type: "DECREMENT", payload: itemId });
  const removeItem = (itemId) => dispatch({ type: "REMOVE_ITEM", payload: itemId });
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const getTotalItems = () => state.items.reduce((s, i) => s + i.quantity, 0);
  const getSubtotal = () => state.items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        ...state,
        items: state.items,
        addToCart,
        increment,
        decrement,
        removeItem,
        clearCart,
        getTotalItems,
        getSubtotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
