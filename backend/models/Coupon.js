import mongoose from "mongoose";

const couponSchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, uppercase: true }, // Tên mã (VD: SALE10)
    discount: { type: Number, required: true }, // Số % giảm (VD: 10 nghĩa là 10%)
    expiryDate: { type: Date, required: true }, // Ngày hết hạn
    isActive: { type: Boolean, required: true, default: true },
  },
  { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
