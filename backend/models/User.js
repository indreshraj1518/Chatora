const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },


    isVerified: {
      type: Boolean,
      default: false,
    },

    role: {
      type: String,
      enum: ["user", "admin", "delivery"],
      default: "user",
    },

    // 🚚 Delivery Boy Extra Fields
    isAvailable: {
      type: Boolean,
      default: true,
    },

    currentLocation: {
      lat: Number,
      lng: Number,
    },
   phone: {
  type: String,
  required: false, // ❗ change here
  unique: true,
  sparse: true, // ⚠️ important (null allowed multiple times)
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);