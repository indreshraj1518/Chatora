exports.generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

exports.sendOTP = async ({ phone, email, otp, type = "console" }) => {
  try {
    if (!otp) {
      console.log("OTP missing");
      return;
    }

    // 🧪 DEFAULT (console)
    if (type === "console") {
      console.log(`🔐 OTP for ${phone || email}: ${otp}`);
    }

    // 📱 SMS (Future - Fast2SMS / Twilio)
    if (type === "sms" && phone) {
      console.log(`📲 Sending OTP to ${phone}: ${otp}`);
      // integrate SMS API here
    }

    // 📧 EMAIL (Future)
    if (type === "email" && email) {
      console.log(`📧 Sending OTP to ${email}: ${otp}`);
      // integrate nodemailer here
    }

  } catch (err) {
    console.log("OTP Error:", err.message);
  }
};