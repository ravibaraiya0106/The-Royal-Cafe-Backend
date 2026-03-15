const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const mongoose = require("mongoose");
const { MESSAGES } = require("../constants/constant");

/* ================= ADD TO CART =================  */
const addToCart = async (userId, data = {}) => {
  const product = await Product.findOne({
    _id: data.product,
    is_active: true,
  });

  if (!product) {
    throw new Error(MESSAGES.PRODUCT.NOT_FOUND);
  }

  const existingItem = await Cart.findOne({
    user: userId,
    product: data.product,
    is_active: true,
  });

  if (existingItem) {
    existingItem.quantity += data.quantity || 1;
    await existingItem.save();
    return existingItem;
  }

  const cartItem = await Cart.create({
    user: userId,
    product: data.product,
    quantity: data.quantity || 1,
    price: product.price,
  });

  return cartItem;
};

/* ================= GET USER CART =================  */

const getUserCart = async (userId) => {
  const cartItems = await Cart.find({
    user: userId,
    is_active: true,
  })
    .populate("product", "name price image")
    .sort({
      createdAt: -1,
    });

  return cartItems;
};

/* ================= REMOVE TO CART =================  */
const removeToCart = async (userId, id = null) => {
  console.log("user id ", userId, "id", id);
  const cartItem = await Cart.findOne({
    _id: id,
    is_active: true,
    user: userId,
  });

  if (!cartItem) {
    throw new Error(MESSAGES.CART.NOT_FOUND);
  }

  if (cartItem.quantity > 1) {
    cartItem.quantity -= 1;
  } else {
    cartItem.deleted_at = new Date();
    cartItem.is_active = false;
  }

  await cartItem.save();

  return cartItem;
};

/* ================= REMOVE ITEM ================= */
const removeFromCart = async (id = null) => {
  const cartItem = await Cart.findOneAndUpdate(
    { _id: id, is_active: true },
    { deleted_at: new Date(), is_active: false },
    { new: true },
  );

  if (!cartItem) {
    throw new Error(MESSAGES.CART.NOT_FOUND);
  }
  return true;
};

/* ================= CLEAR CART ================= */
const clearCart = async (userId) => {
  const cartItems = await Cart.updateMany(
    { user: userId, is_active: true },
    { deleted_at: new Date(), is_active: false },
  );

  if (!cartItems) {
    throw new Error(MESSAGES.CART.NOT_FOUND);
  }
  return true;
};

/* ================= USER CART COUNT ================= */
const userCartCount = async (userId) => {
  const result = await Cart.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        is_active: true,
      },
    },
    {
      $group: {
        _id: null,
        totalQuantity: { $sum: "$quantity" },
      },
    },
  ]);
  return result.length > 0 ? result[0].totalQuantity : 0;
};

module.exports = {
  addToCart,
  getUserCart,
  removeToCart,
  removeFromCart,
  clearCart,
  userCartCount,
};
