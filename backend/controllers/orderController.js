const Order = require("../models/Order");
const User = require("../models/User");
const { sendRealtimeNotification } = require("../utils/sendRealtimeNotification");

// 🔐 GENERATE OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 🚚 DELIVERY CHARGE LOGIC
const calculateDeliveryCharge = (totalAmount) => {
  if (totalAmount > 299) return 0;
  return 30;
};



// ➕ CREATE ORDER (WITH LOCATION + OTP)
exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount, location } = req.body;

    if (!items || !totalAmount || !location) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const otp = generateOTP();
    const deliveryCharge = calculateDeliveryCharge(totalAmount);

    const order = await Order.create({
      userId: req.user.id,
      items,
      totalAmount,
      deliveryCharge,
      location,
      otp,
      status: "pending",
    });

    console.log("User OTP:", otp);

    // 🔔 REALTIME NOTIFICATION (USER)
    const io = req.app.get("io");
    if (io) {
      io.to(req.user.id.toString()).emit("notification", {
        message: "✅ Order placed successfully",
        orderId: order._id,
        time: new Date(),
      });
    }

    res.status(201).json({
      message: "Order created successfully",
      data: order,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// 📦 GET ALL ORDERS (ADMIN)
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId")
      .populate("deliveryBoyId")
      .sort({ createdAt: -1 });

    res.json({
      message: "Orders fetched",
      data: orders,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// 👤 GET MY ORDERS (USER)
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

    res.json({
      message: "My orders fetched",
      data: orders,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// 🚚 GET DELIVERY ORDERS
exports.getDeliveryOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryBoyId: req.user.id,
    })
      .populate("userId")
      .sort({ createdAt: -1 });

    res.json({
      message: "Delivery orders fetched",
      data: orders,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// 👑 ASSIGN DELIVERY BOY (ADMIN)
exports.assignOrder = async (req, res) => {
  try {
    const { orderId, deliveryBoyId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.deliveryBoyId) {
      return res.status(400).json({ message: "Order already assigned" });
    }

    if (order.status === "cancelled") {
      return res.status(400).json({ message: "Cannot assign cancelled order" });
    }

    const deliveryBoy = await User.findById(deliveryBoyId);
    if (!deliveryBoy || deliveryBoy.role !== "delivery") {
      return res.status(400).json({ message: "Invalid delivery boy" });
    }

    order.deliveryBoyId = deliveryBoyId;
    order.status = "assigned";

    await order.save();

    console.log("Order assigned to delivery boy");

    // 🔔 REALTIME NOTIFICATION (DELIVERY BOY)
    const io = req.app.get("io");
    if (io) {
      io.to(deliveryBoyId.toString()).emit("notification", {
        message: "📦 New order assigned to you",
        orderId: order._id,
        time: new Date(),
      });
    }

    res.json({
      message: "Order assigned successfully",
      data: order,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// 🚚 DELIVERY BOY ACCEPT / REJECT
exports.deliveryResponse = async (req, res) => {
  try {
    const { orderId, action } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.deliveryBoyId?.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (["delivered", "cancelled"].includes(order.status)) {
      return res.status(400).json({ message: "Order already completed" });
    }

    if (action === "accept") {
      order.status = "picked";
      order.acceptedAt = new Date();

      // 🔔 notify user
      const io = req.app.get("io");
      if (io) {
        io.to(order.userId.toString()).emit("notification", {
          message: "🚚 Delivery boy is on the way",
          orderId: order._id,
          time: new Date(),
        });
      }

    } else if (action === "reject") {
      order.status = "pending";
      order.deliveryBoyId = null;
    }

    await order.save();

    res.json({
      message: `Order ${action}ed successfully`,
      data: order,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔄 UPDATE STATUS
exports.updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({
      message: "Status updated",
      data: order,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ❌ CANCEL ORDER (USER WITH TIME LIMIT)
exports.cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const diff = (Date.now() - new Date(order.createdAt)) / 1000;

    if (diff > 300) {
      return res.status(400).json({
        message: "Cancel time expired",
      });
    }

    order.status = "cancelled";
    await order.save();

    res.json({
      message: "Order cancelled successfully",
      data: order,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// 🔐 VERIFY OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.deliveryBoyId?.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    if (order.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP ❌" });
    }

    order.status = "delivered";
    order.deliveredAt = new Date();

    await order.save();

    // 🔔 notify user
    const io = req.app.get("io");
    if (io) {
      io.to(order.userId.toString()).emit("notification", {
        message: "🎉 Order delivered successfully",
        orderId: order._id,
        time: new Date(),
      });
    }

    res.json({
      message: "Order delivered successfully ✅",
      data: order,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};