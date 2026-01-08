import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview, // Import hàm review vào
} from "../controllers/productController.js";
import { protect, protectAdmin } from "../middleware/authMiddleware.js";

const productRoutes = express.Router();

productRoutes.route("/").get(getProducts).post(protectAdmin, createProduct);

// 👇 Route mới: Tạo đánh giá (Chỉ User đã login mới được review)
productRoutes.route("/:id/reviews").post(protect, createProductReview);

productRoutes
  .route("/:id")
  .get(getProductById)
  .put(protectAdmin, updateProduct)
  .delete(protectAdmin, deleteProduct);

export default productRoutes;
