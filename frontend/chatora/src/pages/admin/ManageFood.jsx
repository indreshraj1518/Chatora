import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const ManageFood = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  // 📦 Fetch foods
  const fetchFoods = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/food/all`);
      setFoods(res.data.data || []);

    } catch (err) {
      console.log("Fetch error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // ❌ Delete food
  const deleteFood = async (id) => {
    if (!window.confirm("Delete this food?")) return;

    try {
      await axios.delete(`${API}/food/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Food deleted ✅");
      fetchFoods();

    } catch (err) {
      console.log("Delete error:", err.response?.data || err.message);
      alert("Error deleting ❌");
    }
  };

  // ✏️ Edit food (BETTER)
  const editFood = async (food) => {
    const newName = prompt("New Name", food.name);
    const newPrice = prompt("New Price", food.price);

    if (!newName || !newPrice) return;

    try {
      await axios.put(
        `${API}/food/update/${food._id}`, // ✅ fixed endpoint
        {
          name: newName,
          price: Number(newPrice),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Food updated ✅");
      fetchFoods();

    } catch (err) {
      console.log("Update error:", err.response?.data || err.message);
      alert("Error updating ❌");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">

      <h1 className="text-2xl font-bold mb-6">📝 Manage Food</h1>

      {loading ? (
        <p>Loading foods...</p>
      ) : foods.length === 0 ? (
        <p>No food found</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">

          {foods.map((food) => (
            <div
              key={food._id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow flex gap-4"
            >
              {/* 🍔 Image */}
              <img
                src={food.image}
                alt={food.name}
                className="w-24 h-24 object-cover rounded"
              />

              <div className="flex-1">

                <h2 className="font-bold text-lg">{food.name}</h2>
                <p className="text-sm text-gray-500">{food.category}</p>

                <p className="mt-1 font-semibold text-orange-500">
                  ₹{food.price}
                </p>

                {/* ✅ Sizes */}
                {food.sizes && (
                  <p className="text-sm">
                    S: ₹{food.sizes.small} | M: ₹{food.sizes.medium} | L: ₹{food.sizes.large}
                  </p>
                )}

                {/* ✅ Discount */}
                {food.discount > 0 && (
                  <p className="text-green-500 text-sm">
                    {food.discount}% OFF
                  </p>
                )}

                <div className="flex gap-2 mt-3">

                  {/* Edit */}
                  <button
                    onClick={() => editFood(food)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    ✏️ Edit
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => deleteFood(food._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    ❌ Delete
                  </button>

                </div>

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default ManageFood;