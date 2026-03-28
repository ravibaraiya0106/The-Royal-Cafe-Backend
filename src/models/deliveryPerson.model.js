const mongoose = require("mongoose");

const deliveryPersonSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
    },

    email: {
      type: String,
      default: null,
    },

    vehicle_type: {
      type: String,
      enum: ["bike", "cycle", "scooter"],
      default: "bike",
    },

    vehicle_number: {
      type: String,
      default: null,
    },

    is_available: {
      type: Boolean,
      default: true,
    },

    is_active: {
      type: Boolean,
      default: true,
    },

    current_location: {
      lat: Number,
      lng: Number,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("DeliveryPerson", deliveryPersonSchema);
