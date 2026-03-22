const Food = require("../models/Food");

// ➕ ADD FOOD
exports.addFood = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      subCategory,
      price,
      sizes,
      discount,
      image,
    } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({
        message: "Name, Category and Price are required",
      });
    }

    const existing = await Food.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Food already exists" });
    }

    const food = await Food.create({
      name,
      description,
      category,
      subCategory,
      price,
      sizes: sizes || [],
      discount: discount || 0,
      image,
    });

    res.status(201).json({
      message: "Food added successfully",
      data: food,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 📦 GET ALL FOOD (FILTER + SEARCH)
exports.getFoods = async (req, res) => {
  try {
    const { category, subCategory, search } = req.query;

    let filter = {};

    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    const foods = await Food.find(filter).sort({ createdAt: -1 });

    res.json({
      message: "Foods fetched successfully",
      data: foods,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔍 GET SINGLE FOOD
exports.getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    res.json({
      message: "Food fetched successfully",
      data: food,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✏️ UPDATE FOOD
exports.updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    const updated = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Food updated successfully",
      data: updated,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ❌ DELETE FOOD
exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    await Food.findByIdAndDelete(req.params.id);

    res.json({ message: "Food deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};