const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    discount_type: {
      type: String,
      enum: ["percentage", "flat"],
      required: true,
    },

    discount_value: {
      type: Number,
      required: true,
    },

    min_order_amount: {
      type: Number,
      default: 0,
    },

    max_discount: {
      type: Number,
      default: null,
    },

    expiry_date: {
      type: Date,
      required: true,
    },

    usage_limit: {
      type: Number,
      default: null,
    },

    used_count: {
      type: Number,
      default: 0,
    },

    is_active: {
      type: Boolean,
      default: true,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Coupon", couponSchema);
