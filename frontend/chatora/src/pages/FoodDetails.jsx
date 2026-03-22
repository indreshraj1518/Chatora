import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const FoodDetails = () => {
  const { id } = useParams();

  const [food, setFood] = useState(null);
  const [size, setSize] = useState("medium");
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/food/${id}`);
        setFood(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchFood();
  }, [id]);

  if (!food) {
    return (
      <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
        Loading...
      </div>
    );
  }

  // 💰 price calculation
  const basePrice = food.sizes?.[size] || food.price;
  const totalPrice = basePrice * qty;

  // 🛒 Add to cart
  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const item = {
      foodId: food._id,
      name: food.name,
      price: basePrice,
      size,
      qty,
      image: food.image,
    };

    cart.push(item);

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Added to cart 🛒");
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">

      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border dark:border-gray-700">

        {/* 🖼️ Image */}
        <img
          src={food.image}
          className="w-full h-80 object-cover rounded-lg"
        />

        {/* 🍔 Name */}
        <h1 className="text-3xl font-bold mt-4">{food.name}</h1>

        {/* 📝 Description */}
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          {food.description}
        </p>

        {/* 📏 Size */}
        <div className="mt-4">
          <h2 className="font-semibold">Select Size:</h2>

          <div className="flex gap-3 mt-2">
            {["small", "medium", "large"].map((s) => (
              <button
                key={s}
                onClick={() => setSize(s)}
                className={`px-4 py-1 rounded-lg border transition ${
                  size === s
                    ? "bg-orange-500 text-white"
                    : "bg-white dark:bg-gray-700"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 🔢 Quantity */}
        <div className="mt-4">
          <h2 className="font-semibold">Quantity:</h2>

          <input
            type="number"
            value={qty}
            min={1}
            onChange={(e) => setQty(Number(e.target.value))}
            className="border p-2 w-24 mt-2 rounded dark:bg-gray-700 dark:border-gray-600"
          />
        </div>

        {/* 💰 Price */}
        <h2 className="text-2xl font-bold mt-4 text-orange-500">
          ₹{totalPrice}
        </h2>

        {/* 🛒 Button */}
        <button
          onClick={handleAddToCart}
          className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-semibold transition"
        >
          Add to Cart
        </button>

      </div>
    </div>
  );
};

export default FoodDetails;