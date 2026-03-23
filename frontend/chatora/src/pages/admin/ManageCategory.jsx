import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ token fix (same as whole app)
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  // 📦 Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/category/all`);
      setCategories(res.data.data || []);

    } catch (err) {
      console.log("Category fetch error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // ➕ Add category
  const addCategory = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return alert("Category name required ❌");
    }

    if (!token) {
      return alert("Unauthorized ❌ Please login again");
    }

    try {
      await axios.post(
        `${API}/category/add`, // ✅ fixed endpoint
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

    } catch (err) {
      console.log("Add category error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Error adding category ❌");
    }
  };

  // ❌ Delete category
  const deleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    if (!token) {
      return alert("Unauthorized ❌");
    }

    try {
      await axios.delete(`${API}/category/${id}`, { // ✅ fixed endpoint
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Category deleted ✅");
      fetchCategories();

    } catch (err) {
      console.log("Delete error:", err.response?.data || err.message);
      alert("Error deleting category ❌");
    }
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

        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Add
        </button>
      </form>

      {/* ⏳ Loading */}
      {loading ? (
        <p>Loading categories...</p>
      ) : categories.length === 0 ? (
        <p>No categories found</p>
      ) : (
        categories.map((cat) => (
          <div
            key={cat._id}
            className="bg-white dark:bg-gray-800 p-4 mb-3 rounded shadow flex justify-between items-center"
          >
            <p className="font-semibold">{cat.name}</p>

            <button
              onClick={() => deleteCategory(cat._id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              ❌ Delete
            </button>
          </div>
        ))
      )}

    </div>
  );
};

export default ManageCategory;