const express = require("express");
const router = express.Router();
const { otpLogin } = require("../controllers/authController");


const {
  register,
  login
} = require("../controllers/authController");
router.post("/otp-login", otpLogin);


// 🔐 REGISTER
router.post("/register", register);

// 🔐 LOGIN
router.post("/login", login);


module.exports = router;