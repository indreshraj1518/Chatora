const Order = require("../models/Order");

// 📏 Distance (Haversine)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (val) => (val * Math.PI) / 180;

  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};


// 🚚 GET MY DELIVERIES
exports.getMyDeliveries = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryBoyId: req.user.id,
    })
      .populate("userId")
      .sort({ createdAt: -1 });

    res.json({
      message: "My deliveries fetched",
      data: orders,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🚚 ACCEPT / REJECT ORDER
exports.deliveryResponse = async (req, res) => {
  try {
    const { orderId, action, currentLocation } = req.body;

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

    let distance = null;

    if (
      currentLocation &&
      order.location?.lat &&
      order.location?.lng
    ) {
      distance = calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        order.location.lat,
        order.location.lng
      );
    }

    if (action === "accept") {
      order.status = "picked";
      order.acceptedAt = new Date();
    }

    if (action === "reject") {
      order.status = "pending";
      order.deliveryBoyId = null;
    }

    await order.save();

    res.json({
      message: `Order ${action}ed successfully`,
      data: order,
      distance: distance ? `${distance.toFixed(2)} km` : null,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔐 VERIFY OTP (DELIVER COMPLETE)
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
      return res.status(400).json({ message: "Invalid OTP" });
    }

    order.status = "delivered";
    order.deliveredAt = new Date();

    await order.save();

    res.json({
      message: "Order delivered successfully",
      data: order,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 📊 DELIVERY HISTORY + EARNINGS
exports.getDeliveryStats = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryBoyId: req.user.id,
      status: "delivered",
    });

    const totalDeliveries = orders.length;

    const totalEarnings = orders.reduce((sum, order) => {
      return sum + (order.deliveryCharge || 0);
    }, 0);

    res.json({
      message: "Delivery stats fetched",
      totalDeliveries,
      totalEarnings,
      data: orders,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};