import { createSlice } from "@reduxjs/toolkit";
import { updateCart } from "../utils/cartUtils";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : { cartItems: [], shippingAddress: {}, paymentMethod: "PayPal" };

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      return updateCart(state);
    },
    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      return updateCart(state);
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      return updateCart(state);
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      return updateCart(state);
    },
    clearCartItems: (state) => {
      state.cartItems = [];
      return updateCart(state);
    },
    // Hàm này đã có trong reducers
    setCart: (state, action) => {
      return action.payload;
    },
    // Nếu anh vẫn giữ resetCart thì để lại, không thì xóa đi cũng được
    resetCart: (state) => {
      state.cartItems = [];
      state.shippingAddress = {};
      state.paymentMethod = "PayPal";
      return updateCart(state);
    },
    saveCoupon: (state, action) => {
      state.coupon = action.payload; // payload sẽ là { discount: 10, code: 'SALE10' }
      return updateCart(state);
    },
    removeCoupon: (state) => {
      state.coupon = null;
      return updateCart(state);
    },
  },
});

// 👇 QUAN TRỌNG: Anh phải thêm "setCart" vào danh sách export dưới đây
export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
  setCart,
  saveCoupon, 
  removeCoupon, 
} = cartSlice.actions;

export default cartSlice.reducer;
