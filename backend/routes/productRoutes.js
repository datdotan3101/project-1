import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getAllCategories, // 👈 QUAN TRỌNG: Phải import hàm này thì mới dùng được
} from "../controllers/productController.js";
import { protect, protectAdmin } from "../middleware/authMiddleware.js";

const productRoutes = express.Router();

// 1. Route gốc (Lấy ds sản phẩm, Tạo sản phẩm)
productRoutes.route("/").get(getProducts).post(protectAdmin, createProduct);

// 2. 👇 ROUTE CATEGORIES (Phải đặt TRƯỚC route /:id)
productRoutes.route("/categories").get(getAllCategories);

// 3. Route Review
productRoutes.route("/:id/reviews").post(protect, createProductReview);

// 4. Route có ID (Phải đặt cuối cùng vì :id sẽ hứng mọi chuỗi)
productRoutes
  .route("/:id")
  .get(getProductById)
  .put(protectAdmin, updateProduct)
  .delete(protectAdmin, deleteProduct);

export default productRoutes;
