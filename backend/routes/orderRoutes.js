import express from "express";
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
} from "../controllers/orderController.js";
import { protect, protectAdmin } from "../middleware/authMiddleware.js";

const orderRoutes = express.Router();

orderRoutes
  .route("/")
  .post(protect, addOrderItems) // User tạo đơn
  .get(protectAdmin, getOrders); // Admin xem tất cả đơn

orderRoutes.route("/myorders").get(protect, getMyOrders); // User xem đơn của mình

orderRoutes.route("/:id").get(protect, getOrderById); // Xem chi tiết đơn

orderRoutes.route("/:id/pay").put(protect, updateOrderToPaid); // Thanh toán

orderRoutes.route("/:id/deliver").put(protectAdmin, updateOrderToDelivered); // Admin giao hàng

export default orderRoutes;
