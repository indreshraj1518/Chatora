exports.sendRealtimeNotification = (req, userId, message) => {
  try {
    const io = req.app.get("io");

    if (!io) {
      console.log("Socket not initialized");
      return;
    }

    io.to(userId.toString()).emit("notification", {
      message,
      time: new Date(),
    });

  } catch (err) {
    console.log("Socket Error:", err.message);
  }
};