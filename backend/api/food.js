exports.getFoods = async (req, res) => {
  try {
    const foods = await Food.find().populate("category");

    res.json({
      message: "Foods fetched",
      data: foods, // ✅ important
    });
  } catch (err) {
    res.status(500).json(err);
  }
};