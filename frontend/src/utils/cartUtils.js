export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2);
};

export const updateCart = (state) => {
  // 1. Tính tổng tiền hàng (chưa giảm)
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)
  );

  // 2. Tính tiền giảm giá (Dựa trên % discount trong state)
  // Nếu chưa có coupon thì discount = 0
  const discountPercent = state.coupon ? state.coupon.discount : 0;
  state.discountAmount = addDecimals(
    Number(state.itemsPrice) * (discountPercent / 100)
  );

  // 3. Tính phí ship (Logic cũ: trên 2tr free ship)
  // Lưu ý: Thường tính ship dựa trên giá TRƯỚC khi giảm, hoặc SAU tùy anh chọn. Ở đây ta tính theo giá gốc.
  state.shippingPrice = addDecimals(
    Number(state.itemsPrice) > 2000000 ? 0 : 30000
  );

  // 4. Tính thuế (10% của giá sau khi đã giảm)
  const priceAfterDiscount =
    Number(state.itemsPrice) - Number(state.discountAmount);
  state.taxPrice = addDecimals(Number((0.1 * priceAfterDiscount).toFixed(2)));

  // 5. Tổng cộng cuối cùng
  state.totalPrice = (
    Number(state.itemsPrice) -
    Number(state.discountAmount) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(0);

  return state;
};
