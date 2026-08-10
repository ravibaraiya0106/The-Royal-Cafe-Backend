const mongoose = require("mongoose");

const orderStatusHistorySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "preparing",
        "delivered",
        "cancelled",
        "delivery_assigned",
        "delivery_picked",
        "delivery_out_for_delivery",
        "delivery_delivered",
        "delivery_cancelled",
      ],
      required: true,
    },

    changed_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("OrderStatusHistory", orderStatusHistorySchema);
