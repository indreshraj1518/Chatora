const express = require("express");
const router = express.Router();

// controllers
const {
  addFood,
  getFoods,
  deleteFood,
  updateFood,
  getFoodById
} = require("../controllers/foodController");

// middleware
const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// 🔓 PUBLIC
router.get("/all", getFoods);
router.get("/:id", getFoodById);

// 🔐 ADMIN
router.post("/add", auth, admin, addFood);
router.put("/:id", auth, admin, updateFood);
router.delete("/:id", auth, admin, deleteFood);

module.exports = router;