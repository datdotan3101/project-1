import express from "express";
import Coupon from "../models/Coupon.js";
const couponRoutes = express.Router();

// API: POST /api/coupons/validate
couponRoutes.post("/validate", async (req, res) => {
  const { couponCode } = req.body;

  try {
    const coupon = await Coupon.findOne({ name: couponCode });

    if (!coupon) {
      return res.status(404).json({ message: "Mã giảm giá không tồn tại" });
    }

    if (!coupon.isActive) {
      return res.status(400).json({ message: "Mã giảm giá đã bị khóa" });
    }

    if (new Date() > coupon.expiryDate) {
      return res.status(400).json({ message: "Mã giảm giá đã hết hạn" });
    }

    // Trả về số % giảm giá
    res.json({ discount: coupon.discount, code: coupon.name });
  } catch (error) {
    res.status(500).json({ message: "Lỗi Server" });
  }
});

export default couponRoutes;
