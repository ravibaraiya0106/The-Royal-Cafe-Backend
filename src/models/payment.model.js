const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    payment_method: {
      type: String,
      enum: ["COD", "RAZORPAY"],
      required: true,
    },

    transaction_id: {
      type: String,
      default: null,
    },

    razorpay_order_id: {
      type: String,
      default: null,
    },

    razorpay_payment_id: {
      type: String,
      default: null,
    },

    razorpay_signature: {
      type: String,
      default: null,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    payment_status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },

    paid_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Payment", paymentSchema);
