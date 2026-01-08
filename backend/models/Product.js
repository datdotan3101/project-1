import mongoose from "mongoose";

// Schema cho phần đánh giá (Review) - Nằm bên trong Product
const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Link tới người dùng bình thường
    },
  },
  { timestamps: true }
);

const productSchema = mongoose.Schema(
  {
    // Link tới Admin người đã tạo ra sản phẩm này
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Admin",
    },
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true, // Ví dụ: 'Phone', 'Laptop'
    },
    description: {
      type: String,
      required: true,
    },

    // --- Các thông số kỹ thuật (Specs) - Để ở Root theo yêu cầu ---
    ram: { type: String, required: true }, // VD: "8GB", "16GB"
    storage: { type: String, required: true }, // VD: "256GB SSD"
    color: { type: String, required: true },
    os: { type: String, required: true }, // VD: "iOS 17", "Windows 11"
    screenSize: { type: String, required: true }, // VD: "6.7 inch"
    origin: { type: String, required: true }, // Xuất xứ: "Vietnam", "China"
    // -------------------------------------------------------------

    reviews: [reviewSchema], // Mảng chứa các đánh giá

    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Product", productSchema);

export default Product;
