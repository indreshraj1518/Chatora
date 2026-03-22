const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");
const role = require("../middleware/roleMiddleware");

const {
  createOrder,
  getOrders,
  assignOrder,
  updateStatus,
  getDeliveryOrders,
  getMyOrders,
  deliveryResponse,
  cancelOrder,
  verifyOTP
} = require("../controllers/orderController");


// ================= USER ROUTES =================

// ➕ Create Order
router.post("/create", auth, createOrder);

// 👤 My Orders
router.get("/my", auth, getMyOrders);

// ❌ Cancel Order
router.post("/cancel", auth, cancelOrder);


// ================= ADMIN ROUTES =================

// 📦 Get All Orders
router.get("/all", auth, admin, getOrders);

// 👑 Assign Delivery Boy
router.post("/assign", auth, admin, assignOrder);

// 🔄 Update Status
router.post("/status", auth, admin, updateStatus);


// ================= DELIVERY BOY ROUTES =================

// 🚚 My Deliveries
router.get("/my-deliveries", auth, role("delivery"), getDeliveryOrders);

// ✅ Accept / ❌ Reject
router.post("/delivery-response", auth, role("delivery"), deliveryResponse);

// 🔐 Verify OTP
router.post("/verify/:orderId", auth, role("delivery"), verifyOTP);


module.exports = router;