import asyncHandler from "../middleware/asyncHandler.js";
import Product from "../models/Product.js";

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 8;
  const page = Number(req.query.pageNumber) || 1;

  const count = await Product.countDocuments({});

  const products = await Product.find({})
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    return res.json(product);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    image,
    brand,
    category,
    countInStock,
    description,
    ram,
    storage,
    color,
    os,
    screenSize,
    origin,
  } = req.body;

  if (!req.admin) {
    res.status(401);
    throw new Error("Lỗi: Không tìm thấy thông tin Admin");
  }

  const product = new Product({
    name,
    price,
    admin: req.admin._id, // Khớp với Schema và Middleware
    image,
    brand,
    category,
    countInStock,
    numReviews: 0,
    description,
    ram,
    storage,
    color,
    os,
    screenSize,
    origin,
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
    product.name = name;
    product.price = price;
    product.description = description;
    product.image = image;
    product.brand = brand;
    product.category = category;
    product.countInStock = countInStock;

    // Cập nhật specs
    product.ram = ram;
    product.storage = storage;
    product.color = color;
    product.os = os;
    product.screenSize = screenSize;
    product.origin = origin;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.status(200).json({ message: "Product deleted" });
  } else {
    res.status(404);
    throw new Error("Resource not found");
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  // Logic review của bạn (giữ nguyên placeholder nếu chưa phát triển)
  res.send("Review");
});

// @desc    Get all unique categories
// @route   GET /api/products/categories
// @access  Private/Admin
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Product.find({}).distinct("category");
  res.json(categories);
});

export {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  createProductReview,
  getAllCategories, // Đã export đầy đủ
};
