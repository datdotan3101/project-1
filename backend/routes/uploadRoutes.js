import path from "path";
import express from "express";
import multer from "multer";
import { fileURLToPath } from "url";
import fs from "fs";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cấu hình đường dẫn
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const uploadPath = path.join(__dirname, "../uploads/");

    // Tự tạo thư mục nếu chưa có
    if (!fs.existsSync(uploadPath)) {
      console.log("Thư mục chưa tồn tại, đang tạo mới:", uploadPath);
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Hàm lọc file
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    // Trả về error object thay vì string để dễ bắt lỗi
    cb(new Error("Chỉ chấp nhận file ảnh (jpg, jpeg, png)!"));
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// 👇 ROUTE QUAN TRỌNG: Bọc Middleware để bắt lỗi
router.post("/", (req, res) => {
  // Gọi hàm upload thủ công bên trong route
  upload.single("image")(req, res, function (err) {
    // 1. Nếu có lỗi từ Multer (File quá lớn, sai định dạng, không tìm thấy thư mục...)
    if (err) {
      console.log("❌ LỖI UPLOAD:", err); // In lỗi ra terminal cho bạn xem
      return res.status(400).send({
        message: err.message || "Lỗi khi upload ảnh",
        error: err, // Trả chi tiết lỗi về Postman
      });
    }

    // 2. Nếu không chọn file
    if (!req.file) {
      console.log("❌ LỖI: Chưa chọn file nào");
      return res
        .status(400)
        .send({ message: "Vui lòng chọn file ảnh để upload" });
    }

    // 3. Nếu thành công
    console.log("✅ Upload thành công:", req.file.path);

    // Fix đường dẫn cho Windows
    const imagePath = `uploads/${req.file.filename}`;

    res.send({
      message: "Image Uploaded",
      image: `/${imagePath}`,
    });
  });
});

export default router;
