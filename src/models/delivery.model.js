const mongoose = require("mongoose");

const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    delivery_person: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPerson",
      required: true,
    },

    delivery_status: {
      type: String,
      enum: ["assigned", "picked", "out_for_delivery", "delivered", "cancelled"],
      default: "assigned",
    },

    pickup_at: {
      type: Date,
      default: null,
    },

    delivered_at: {
      type: Date,
      default: null,
    },

    notes: {
      type: String,
      default: "",
    },

    cash_collected: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Delivery", deliverySchema);
