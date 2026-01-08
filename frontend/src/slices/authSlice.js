import { createSlice } from "@reduxjs/toolkit";

// Kiểm tra xem trong LocalStorage có lưu user chưa
const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Hàm đăng nhập: Lưu user vào Redux và LocalStorage
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    // Hàm đăng xuất: Xóa sạch
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
