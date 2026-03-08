const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    order_number: {
      type: String,
      unique: true,
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    total_amount: {
      type: Number,
      required: true,
      min: 0,
    },

    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },

    discount_amount: {
      type: Number,
      default: 0,
    },

    final_amount: {
      type: Number,
      required: true,
      min: 0,
    },

    payment_method: {
      type: String,
      enum: ["COD", "UPI", "CARD"],
      default: "COD",
    },

    payment_status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    order_status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "delivered", "cancelled"],
      default: "pending",
    },

    address: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      required: true,
    },

    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Order", orderSchema);
