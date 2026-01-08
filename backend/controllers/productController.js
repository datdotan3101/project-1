import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/Product.js";

// @desc    Fetch all products (Có Phân trang & Search & Filter)
// @route   GET /api/products?keyword=iphone&pageNumber=1
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  // 1. Cấu hình phân trang
  const pageSize = 8; // Số sản phẩm trên 1 trang (Anh có thể đổi thành 4, 8, 12)
  const page = Number(req.query.pageNumber) || 1; // Trang hiện tại (mặc định là 1)

  // 2. Xử lý tìm kiếm theo từ khóa (Keyword)
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i", // Không phân biệt hoa thường
        },
      }
    : {};

  // 3. Tổng hợp bộ lọc (Keyword + Brand + Category + Specs)
  const filter = { ...keyword };
  if (req.query.brand) filter.brand = req.query.brand;
  if (req.query.category) filter.category = req.query.category;
  if (req.query.ram) filter.ram = req.query.ram; // Ví dụ lọc thêm RAM

  // 4. Đếm tổng số lượng sản phẩm khớp với bộ lọc (để tính tổng số trang)
  const count = await Product.countDocuments(filter);

  // 5. Query lấy sản phẩm theo trang
  const products = await Product.find(filter)
    .limit(pageSize) // Giới hạn số lượng
    .skip(pageSize * (page - 1)); // Bỏ qua các sản phẩm của trang trước

  // Trả về: danh sách SP, trang hiện tại, tổng số trang
  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample Name",
    price: 0,
    user: req.user._id, // Hoặc req.admin._id tùy middleware anh dùng
    admin: req.admin._id,
    image: "/images/sample.jpg",
    brand: "Sample Brand",
    category: "Sample Category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
    ram: "Sample RAM",
    storage: "Sample Storage",
    color: "Sample Color",
    os: "Sample OS",
    screenSize: "Sample Screen",
    origin: "Sample Origin",
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock,
    ram,
    storage,
    color,
    os,
    screenSize,
    origin,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.image = image || product.image;
    product.brand = brand || product.brand;
    product.category = category || product.category;
    product.countInStock = countInStock || product.countInStock;

    // Update specs
    product.ram = ram || product.ram;
    product.storage = storage || product.storage;
    product.color = color || product.color;
    product.os = os || product.os;
    product.screenSize = screenSize || product.screenSize;
    product.origin = origin || product.origin;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private (User)
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    // 1. Kiểm tra xem user này đã review sản phẩm này chưa
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error("Sản phẩm này bạn đã đánh giá rồi");
    }

    // 2. Tạo review mới
    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    // 3. Đẩy review vào mảng
    product.reviews.push(review);

    // 4. Cập nhật số lượng review
    product.numReviews = product.reviews.length;

    // 5. Tính toán lại điểm trung bình (Rating)
    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();
    res.status(201).json({ message: "Đánh giá đã được thêm" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview, 
};
