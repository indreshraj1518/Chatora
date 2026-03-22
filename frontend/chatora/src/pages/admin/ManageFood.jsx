import { useEffect, useState } from "react";
import axios from "axios";

const ManageFood = () => {
  const [foods, setFoods] = useState([]);
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  // 📦 Fetch foods
  const fetchFoods = async () => {
    const res = await axios.get("http://localhost:5000/api/food/all");
    setFoods(res.data);
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // ❌ Delete food
  const deleteFood = async (id) => {
    if (!window.confirm("Delete this food?")) return;

    await axios.delete(`http://localhost:5000/api/food/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Food deleted ✅");
    fetchFoods();
  };

  // ✏️ Edit food (simple prompt based)
  const editFood = async (food) => {
    const newName = prompt("New Name", food.name);
    const newPrice = prompt("New Price", food.price);

    if (!newName || !newPrice) return;

    await axios.put(
      `http://localhost:5000/api/food/${food._id}`,
      {
        name: newName,
        price: newPrice,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Food updated ✅");
    fetchFoods();
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">

      <h1 className="text-2xl font-bold mb-6">📝 Manage Food</h1>

      {foods.map((food) => (
        <div
          key={food._id}
          className="bg-white dark:bg-gray-800 p-4 mb-4 rounded shadow flex justify-between items-center"
        >
          <div>
            <h2 className="font-bold text-lg">{food.name}</h2>
            <p>₹{food.price}</p>
            <p className="text-sm text-gray-500">{food.category}</p>
          </div>

          <div className="flex gap-2">

            {/* Edit */}
            <button
              onClick={() => editFood(food)}
              className="bg-blue-500 text-white px-3 py-1 rounded"
            >
              ✏️ Edit
            </button>

            {/* Delete */}
            <button
              onClick={() => deleteFood(food._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              ❌ Delete
            </button>

          </div>
        </div>
      ))}

    </div>
  );
};

export default ManageFood;