import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cart.jsx";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
});
