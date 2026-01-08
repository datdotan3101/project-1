// Hàm làm tròn 2 chữ số thập phân
export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2); // Trả về chuỗi
};

// Hàm cập nhật giá (Dùng chung cho Add và Remove)
export const updateCart = (state) => {
  // 1. Tính tổng giá các món hàng
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // 2. Tính phí ship (Ví dụ: Đơn > 2tr thì free ship, dưới thì 30k)
  // Lưu ý: itemsPrice đang là string do toFixed, cần parse về Number để so sánh
  state.shippingPrice = addDecimals(
    Number(state.itemsPrice) > 2000000 ? 0 : 30000
  );

  // 3. Tính thuế (Ví dụ 10% VAT)
  state.taxPrice = addDecimals(Number((0.1 * state.itemsPrice).toFixed(2)));

  // 4. Tổng cộng
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(0); // Tổng tiền thì làm tròn chẵn luôn cho đẹp

  // 5. Lưu vào LocalStorage
  // localStorage.setItem("cart", JSON.stringify(state));

  return state;
};
