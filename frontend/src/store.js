import { configureStore } from "@reduxjs/toolkit";
import cartSliceReducer from "./slices/cartSlice";
import authSliceReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    cart: cartSliceReducer,
    auth: authSliceReducer,
    // Sau này sẽ thêm authReducer, productReducer vào đây
  },
});

export default store;
