const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    delivery_person: {
      type: String,
      required: true,
    },

    delivery_status: {
      type: String,
      enum: ["assigned", "picked", "delivered"],
      default: "assigned",
    },

    delivered_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Delivery", deliverySchema);
