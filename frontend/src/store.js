import { configureStore } from "@reduxjs/toolkit";
import cartSliceReducer from "./slices/cartSlice";
import authSliceReducer from "./slices/authSlice";
import adminAuthSliceReducer from "./slices/admin/adminAuthSlice";

const store = configureStore({
  reducer: {
    cart: cartSliceReducer,
    auth: authSliceReducer,
    adminAuth: adminAuthSliceReducer,
    // Sau này sẽ thêm authReducer, productReducer vào đây
  },
});

export default store;
