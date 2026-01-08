import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import User from "../models/User.js";
import Admin from "../models/Admin.js";

// 👇 1. Middleware bảo vệ Route dành cho USER (Khách mua hàng)
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Kiểm tra xem header có gửi token dạng "Bearer xyz..." không
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Lấy token (bỏ chữ 'Bearer ' ở đầu)
      token = req.headers.authorization.split(" ")[1];

      // Giải mã token để lấy ID
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm User trong DB dựa vào ID (trừ trường password ra)
      req.user = await User.findById(decoded.userId).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("User không tồn tại hoặc đã bị xóa");
      }

      next(); // Cho phép đi tiếp
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Không có quyền truy cập, Token sai");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Không có quyền truy cập, không tìm thấy Token");
  }
});

// 👇 2. Middleware bảo vệ Route dành cho ADMIN (Quản trị viên)
const protectAdmin = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ⚠️ QUAN TRỌNG: Tìm trong collection ADMIN, không phải User
      req.admin = await Admin.findById(decoded.userId).select("-password");

      if (!req.admin) {
        res.status(401);
        throw new Error("Admin không tồn tại");
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Không có quyền Admin, Token sai");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Không có quyền Admin, không tìm thấy Token");
  }
});

export { protect, protectAdmin };
