import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // Kiểm tra xem trong localStorage có lưu thông tin admin chưa
  adminInfo: localStorage.getItem("adminInfo")
    ? JSON.parse(localStorage.getItem("adminInfo"))
    : null,
};

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setAdminCredentials: (state, action) => {
      state.adminInfo = action.payload;
      // Lưu vào localStorage để F5 không bị mất đăng nhập
      localStorage.setItem("adminInfo", JSON.stringify(action.payload));
    },
    logoutAdmin: (state) => {
      state.adminInfo = null;
      localStorage.removeItem("adminInfo");
    },
  },
});

export const { setAdminCredentials, logoutAdmin } = adminAuthSlice.actions;

export default adminAuthSlice.reducer;
