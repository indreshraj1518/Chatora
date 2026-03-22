import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:5000/api";

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ✅ Fetch Foods
  const getFoods = async () => {
    try {
      const res = await axios.get(`${API}/food/all`);
      setFoods(res.data.data || []);
    } catch (err) {
      console.log("Food fetch error:", err);
    }
  };

  // ✅ Fetch Categories
  const getCategories = async () => {
    try {
      const res = await axios.get(`${API}/category/all`);
      setCategories(res.data.data || []);
    } catch (err) {
      console.log("Category fetch error:", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([getFoods(), getCategories()]);
      setLoading(false);
    };
    fetchData();
  }, []);

  // ✅ Filter Logic (FIXED)
  const filteredFoods = foods.filter((item) => {
    return (
      (selectedCat ? item.category === selectedCat : true) &&
      item.name.toLowerCase().includes(search.toLowerCase())
    );
  });

  // ✅ Better Cart Logic (no duplicate items)
  const addToCart = (food) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item.foodId === food._id);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        foodId: food._id,
        name: food.name,
        price: food.price,
        qty: 1,
        image: food.image,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart 🛒");
  };

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-black dark:text-white">

      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-60 bg-white dark:bg-gray-800 p-4 shadow-md border-r dark:border-gray-700">
        <h2 className="text-xl font-bold mb-4">Categories</h2>

        <button
          onClick={() => setSelectedCat("")}
          className={`text-left mb-2 ${
            selectedCat === "" ? "text-orange-500 font-semibold" : ""
          }`}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCat(cat.name)}
            className={`text-left mb-2 hover:text-orange-500 ${
              selectedCat === cat.name
                ? "text-orange-500 font-semibold"
                : ""
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Main */}
      <div className="flex-1 p-4">

        {/* 🔍 Search */}
        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:border-gray-700"
        />

        {/* ⏳ Loading */}
        {loading ? (
          <p className="text-center text-lg">Loading foods...</p>
        ) : (
          <>
            {/* 🍔 Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

              {filteredFoods.map((food) => (
                <div
                  key={food._id}
                  onClick={() => navigate(`/food/${food._id}`)}
                  className="cursor-pointer bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 hover:shadow-xl hover:-translate-y-1 transition"
                >
                  <img
                    src={food.image}
                    alt={food.name}
                    className="w-full h-40 object-cover rounded-lg"
                  />

                  <h2 className="text-lg font-semibold mt-2">
                    {food.name}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {food.category}
                  </p>

                  <div className="flex justify-between items-center mt-3">
                    <span className="text-orange-500 font-bold">
                      ₹{food.price}
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(food);
                      }}
                      className="bg-orange-500 text-white px-3 py-1 rounded-lg hover:bg-orange-600"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ❌ Empty */}
            {filteredFoods.length === 0 && (
              <p className="text-center mt-10 text-gray-500">
                No food found 😢
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;