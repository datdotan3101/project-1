import asyncHandler from "../middleware/asyncHandler.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js"; // 👈 MỚI: Import Product để cập nhật kho

// @desc    Tạo đơn hàng mới
// @route   POST /api/orders
// @access  Private (User)
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("Không có sản phẩm nào trong giỏ hàng");
  } else {
    // 1. Tạo đơn hàng và lưu vào DB
    const order = new Order({
      orderItems: orderItems.map((x) => ({
        ...x,
        product: x._id, // Map _id sản phẩm vào trường product
        _id: undefined,
      })),
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // 🔴 2. LOGIC MỚI: Cập nhật trừ tồn kho (Update Inventory)
    // Sau khi lưu đơn hàng thành công, chạy vòng lặp trừ số lượng từng sản phẩm
    for (const item of orderItems) {
      const product = await Product.findById(item._id);

      if (product) {
        // Trừ số lượng tồn kho bằng số lượng khách mua
        product.countInStock = product.countInStock - item.qty;
        await product.save();
      }
    }

    res.status(201).json(createdOrder);
  }
});

// @desc    Lấy chi tiết 1 đơn hàng
// @route   GET /api/orders/:id
// @access  Private (User & Admin)
const getOrderById = asyncHandler(async (req, res) => {
  // Populate lấy thêm tên và email của user đặt đơn này
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to paid (Giả lập thanh toán thành công)
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    // Lưu kết quả giả lập
    order.paymentResult = {
      id: req.body.id || "MOCK_PAYMENT_ID",
      status: req.body.status || "COMPLETED",
      update_time: Date.now(),
      email_address: req.body.email_address || "mock@example.com",
    };

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update status to Delivered (Admin only)
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveryStatus = "Delivered";
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getOrders,
};
