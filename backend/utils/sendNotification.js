exports.sendNotification = async ({
  to,
  message,
  type = "console"
}) => {
  try {
    if (!to || !message) {
      console.log("Notification skipped: missing data");
      return;
    }

    // 🧪 DEFAULT (console log)
    if (type === "console") {
      console.log(`🔔 Notification to ${to}: ${message}`);
    }

    // 📱 SMS (Future - Twilio / Fast2SMS)
    if (type === "sms") {
      console.log(`📲 SMS to ${to}: ${message}`);
      // integrate API here
    }

    // 📧 EMAIL (Future)
    if (type === "email") {
      console.log(`📧 Email to ${to}: ${message}`);
      // integrate nodemailer here
    }

    // 🔔 PUSH NOTIFICATION (Future)
    if (type === "push") {
      console.log(`📡 Push notification to ${to}: ${message}`);
      // integrate firebase here
    }

  } catch (err) {
    console.log("Notification Error:", err.message);
  }
};