import { useEffect, useState } from "react";
import axios from "axios";

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  // 📦 Fetch categories
  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/api/category/all");
    setCategories(res.data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ➕ Add category
  const addCategory = async (e) => {
    e.preventDefault();

    if (!name) return;

    await axios.post(
      "http://localhost:5000/api/category/add",
      { name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Category added ✅");
    setName("");
    fetchCategories();
  };

  // ❌ Delete category
  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    await axios.delete(`http://localhost:5000/api/category/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("Category deleted ✅");
    fetchCategories();
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">

      <h1 className="text-2xl font-bold mb-6">📂 Manage Categories</h1>

      {/* ➕ Add Category */}
      <form onSubmit={addCategory} className="mb-6 flex gap-2">
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="p-2 border rounded w-64 text-black"
        />

        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Add
        </button>
      </form>

      {/* 📋 Category List */}
      {categories.map((cat) => (
        <div
          key={cat._id}
          className="bg-white dark:bg-gray-800 p-4 mb-3 rounded shadow flex justify-between"
        >
          <p className="font-semibold">{cat.name}</p>

          <button
            onClick={() => deleteCategory(cat._id)}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            ❌ Delete
          </button>
        </div>
      ))}

    </div>
  );
};

export default ManageCategory;