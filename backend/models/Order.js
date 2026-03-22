const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
        },
        name: String,
        quantity: Number,
        price: Number,
        size: String,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    deliveryCharge: {
      type: Number,
      default: 0,
    },

    location: {
      lat: Number,
      lng: Number,
      address: String,
    },

    status: {
      type: String,
      enum: ["pending", "assigned", "picked", "delivered", "cancelled"],
      default: "pending",
    },

    deliveryBoyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    otp: String,

    acceptedAt: Date,
    deliveredAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);