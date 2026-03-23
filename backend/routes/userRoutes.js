const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");



const {
  signup,
  login,
  getDeliveryBoys,
  getUsers,
  deleteUser
} = require("../controllers/userController");

const auth = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

// 🔐 AUTH
router.post("/signup", signup);
router.post("/login", login);

// 👑 ADMIN
router.get("/all", auth, admin, getUsers);
router.delete("/:id", auth, admin, deleteUser);

// 🚚 DELIVERY BOYS
router.get("/delivery-boys", auth, admin, getDeliveryBoys);

// uplod profile pic
router.put("/upload-profile", auth, upload.single("image"), (req, res) => {
  res.json({ image: req.file.filename });
});

module.exports = router;