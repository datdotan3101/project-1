import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path"; // Để xử lý đường dẫn file
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";

// Load biến môi trường
dotenv.config();

// Kết nối Database
connectDB();

const app = express();

// Middleware
app.use(cors()); // Cho phép frontend gọi API
app.use(express.json()); // Để server hiểu dữ liệu JSON gửi lên
app.use(express.urlencoded({ extended: true }));

// Cấu hình thư mục uploads thành public để Frontend xem được ảnh
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Route mẫu kiểm tra server
app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
// app.use("/api/admins", adminRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes); // <-- Mới
app.use("/api/upload", uploadRoutes);
app.use("/api/coupons", couponRoutes);

// Middleware xử lý lỗi chung (Error Handling)
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
