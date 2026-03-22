const express = require("express");
const router = express.Router();

const {
  getMyDeliveries,
  deliveryResponse,
  verifyOTP,
  getDeliveryStats
} = require("../controllers/deliveryController");

const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");


// 🚚 DELIVERY BOY ROUTES

// 📦 My Deliveries
router.get("/my", auth, role("delivery"), getMyDeliveries);

// ✅ Accept / ❌ Reject Order
router.post("/response", auth, role("delivery"), deliveryResponse);

// 🔐 Verify OTP (complete delivery)
router.post("/verify/:orderId", auth, role("delivery"), verifyOTP);

// 📊 Delivery Stats (earnings + history)
router.get("/stats", auth, role("delivery"), getDeliveryStats);


module.exports = router;