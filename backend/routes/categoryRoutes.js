const express = require("express");
const router = express.Router();

const {
  addCategory,
  getCategories,
  deleteCategory,
  updateCategory,
  addSubCategory,
  deleteSubCategory
} = require("../controllers/categoryController");

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// 🌐 PUBLIC
router.get("/all", getCategories);

// 👑 ADMIN
router.post("/add", auth, admin, addCategory);
router.put("/:id", auth, admin, updateCategory);
router.delete("/:id", auth, admin, deleteCategory);

// ➕ SUBCATEGORY
router.post("/:id/sub", auth, admin, addSubCategory);

// ❌ DELETE SUBCATEGORY
router.delete("/:id/sub", auth, admin, deleteSubCategory);

module.exports = router;