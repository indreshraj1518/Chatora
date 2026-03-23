const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

// 🔐 TOKEN
const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "7d" }
  );
};



// 📝 SIGNUP (MANUAL)
exports.register = async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({
        message: "Name, Phone & Password required ❌",
      });
    }

    // ❌ check duplicate
    const existingUser =
      (email && await User.findOne({ email })) ||
      await User.findOne({ phone });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists ❌",
      });
    }

    const hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      phone,
      email,
      password: hash,
    });

    const token = generateToken(user);

    res.json({
      message: "Signup success ✅",
      token,
      user,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// 🔐 LOGIN (EMAIL OR USERNAME)
exports.login = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    if ((!email && !name) || !password) {
      return res.status(400).json({
        message: "Email/Username & Password required ❌",
      });
    }

    let user;

    if (email) {
      user = await User.findOne({ email });
    } else {
      user = await User.findOne({ name });
    }

    if (!user) {
      return res.status(400).json({
        message: "User not found ❌",
      });
    }

    // 👉 Google user (no password)
    if (!user.password) {
      return res.status(400).json({
        message: "Use Google login ❌",
      });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(400).json({
        message: "Wrong password ❌",
      });
    }

    const token = generateToken(user);

    res.json({
      message: "Login success ✅",
      token,
      user,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
exports.otpLogin = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ message: "Phone required ❌" });
    }

    let user = await User.findOne({ phone });

    // 🆕 अगर user नहीं है → create
    if (!user) {
      user = await User.create({
        name: "User",
        phone,
        password: "",
      });
    }

    const token = generateToken(user);

    res.json({
      message: "OTP login success ✅",
      token,
      user,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔵 GOOGLE LOGIN (AUTO SIGNUP)
exports.googleLogin = async (req, res) => {
  try {
    const { email, name } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Google email required ❌",
      });
    }

    let user = await User.findOne({ email });

    // 🟢 EXISTING USER
    if (user) {
      const token = generateToken(user);

      return res.json({
        message: "Login success ✅",
        token,
        user,
      });
    }

    // 🔴 NEW USER → AUTO CREATE
    user = await User.create({
      name: name || "Google User",
      email,
      password: "", // no password
      phone: "", // optional now
    });

    const token = generateToken(user);

    res.json({
      message: "Google signup success ✅",
      token,
      user,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};