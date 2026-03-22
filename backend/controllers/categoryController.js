const Category = require("../models/Category");

// ➕ ADD CATEGORY (with subCategories)
exports.addCategory = async (req, res) => {
  try {
    const { name, subCategories } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Category name required" });
    }

    const existing = await Category.findOne({ name });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({
      name,
      subCategories: subCategories || [],
    });

    res.status(201).json({
      message: "Category created successfully",
      data: category,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 📦 GET ALL CATEGORIES
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });

    res.json({
      message: "Categories fetched successfully",
      data: categories,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ➕ ADD SUBCATEGORY
exports.addSubCategory = async (req, res) => {
  try {
    const { subCategory } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (category.subCategories.includes(subCategory)) {
      return res.status(400).json({ message: "Subcategory already exists" });
    }

    category.subCategories.push(subCategory);
    await category.save();

    res.json({
      message: "Subcategory added successfully",
      data: category,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ❌ DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);

    if (!cat) {
      return res.status(404).json({ message: "Category not found" });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({ message: "Category deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ❌ DELETE SUBCATEGORY
exports.deleteSubCategory = async (req, res) => {
  try {
    const { subCategory } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.subCategories = category.subCategories.filter(
      (sub) => sub !== subCategory
    );

    await category.save();

    res.json({
      message: "Subcategory deleted successfully",
      data: category,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✏️ UPDATE CATEGORY
exports.updateCategory = async (req, res) => {
  try {
    const { name, subCategories } = req.body;

    const cat = await Category.findById(req.params.id);

    if (!cat) {
      return res.status(404).json({ message: "Category not found" });
    }

    const updated = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: name || cat.name,
        subCategories: subCategories || cat.subCategories,
      },
      { new: true }
    );

    res.json({
      message: "Category updated successfully",
      data: updated,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};