import asyncHandler from "../middleware/asyncHandler.js";
import Admin from "../models/Admin.js";
import generateToken from "../utils/generateToken.js";

// @desc    Auth admin & get token
// @route   POST /api/admins/login
// @access  Public
const authAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id), // Trả về token
    });
  } else {
    res.status(401);
    throw new Error("Email hoặc mật khẩu Admin không đúng");
  }
});

// @desc    Register a new admin (Dùng để tạo admin đầu tiên, sau này có thể tắt)
// @route   POST /api/admins
// @access  Public
const registerAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const adminExists = await Admin.findOne({ email });
  if (adminExists) {
    res.status(400);
    throw new Error("Admin đã tồn tại");
  }

  const admin = await Admin.create({ name, email, password });

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id),
    });
  } else {
    res.status(400);
    throw new Error("Dữ liệu Admin không hợp lệ");
  }
});

export { authAdmin, registerAdmin };
