const Order = require("../models/order.model");
const OrderItem = require("../models/orderItem.model");
const Payment = require("../models/payment.model");
const OrderStatusHistory = require("../models/orderStatusHistory.model");

const cartService = require("./cart.service");

const generateOrderNumber = () => {
  const rand = Math.floor(Math.random() * 10000);
  return `RC-${Date.now()}-${rand}`;
};

/* ================= CREATE ORDER ================= */
const createOrder = async (userId, data = {}) => {
  const { address, phone, payment_method = "COD", notes = "" } = data;

  const cartItems = await cartService.getUserCart(userId);
  if (!cartItems || cartItems.length === 0) {
    throw new Error("Cart is empty");
  }

  const totalAmount = cartItems.reduce(
    (sum, it) => sum + it.price * it.quantity,
    0,
  );

  const finalAmount = totalAmount; // No coupon/discount flow wired yet
  const orderStatus = payment_method === "COD" ? "confirmed" : "confirmed";
  const paymentStatus = payment_method === "COD" ? "pending" : "paid";

  const order = await Order.create({
    order_number: generateOrderNumber(),
    user: userId,
    total_amount: totalAmount,
    discount_amount: 0,
    final_amount: finalAmount,
    payment_method,
    payment_status: paymentStatus,
    order_status: orderStatus,
    address,
    phone,
    notes: notes || "",
  });

  // Create order items from cart
  const orderItemsPayload = cartItems.map((cartItem) => ({
    order: order._id,
    product: cartItem.product._id,
    product_name: cartItem.product.name,
    price: cartItem.price,
    quantity: cartItem.quantity,
    subtotal: cartItem.price * cartItem.quantity,
  }));

  const orderItems = await OrderItem.insertMany(orderItemsPayload);

  // Create payment record
  await Payment.create({
    order: order._id,
    payment_method,
    transaction_id: null,
    amount: finalAmount,
    payment_status: paymentStatus,
    paid_at: paymentStatus === "paid" ? new Date() : null,
  });

  await OrderStatusHistory.create({
    order: order._id,
    status: "confirmed",
    changed_at: new Date(),
  });

  // Clear user's cart after order is created
  await cartService.clearCart(userId);

  return {
    order,
    orderItems,
  };
};

/* ================= USER ORDER HISTORY ================= */
const getUserOrders = async (userId) => {
  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .select(
      "order_number final_amount payment_method payment_status order_status createdAt address phone",
    );

  return orders;
};

/* ================= ADMIN ORDER HISTORY (PAGINATED + FILTERED) ================= */
const getAdminOrders = async (query = {}) => {
  const {
    page = 1,
    limit = 10,
    order_number,
    payment_method,
    payment_status,
    order_status,
  } = query;

  const parsedPage = Number(page);
  const parsedLimit = Number(limit);
  const safePage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const safeLimit = Number.isFinite(parsedLimit) && parsedLimit > 0 ? parsedLimit : 10;

  const skip = (safePage - 1) * safeLimit;

  const filter = {};

  if (order_number) {
    // Partial match for order number search
    const q = String(order_number).trim();
    if (q) {
      filter.order_number = { $regex: q, $options: "i" };
    }
  }

  if (payment_method) filter.payment_method = String(payment_method);
  if (payment_status) filter.payment_status = String(payment_status);
  if (order_status) filter.order_status = String(order_status);

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .sort({ createdAt: -1 })
      .select(
        "order_number user final_amount payment_method payment_status order_status createdAt address phone",
      )
      .skip(skip)
      .limit(safeLimit),
    Order.countDocuments(filter),
  ]);

  return {
    data: orders,
    total,
    page: safePage,
    limit: safeLimit,
    totalPages: Math.ceil(total / safeLimit),
  };
};

/* ================= USER ORDER DETAILS ================= */
const getUserOrderDetails = async (userId, orderId) => {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new Error("Order not found");

  const orderItems = await OrderItem.find({ order: order._id }).select(
    "product_name price quantity subtotal",
  );

  return {
    order,
    orderItems,
  };
};

module.exports = {
  createOrder,
  getUserOrders,
  getAdminOrders,
  getUserOrderDetails,
};

