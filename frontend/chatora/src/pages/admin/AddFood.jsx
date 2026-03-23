import { useState, useEffect } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const AddFood = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    small: "",
    medium: "",
    large: "",
    discount: "",
    deliveryCharge: "",
    image: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch categories (FIXED)
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API}/category/all`);
        setCategories(res.data.data || []);
      } catch (err) {
        console.log("Category fetch error:", err);
      }
    };

    fetchCategories();
  }, []);

  // ✅ Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Clean number helper (IMPORTANT FIX)
  const num = (val) => (val ? Number(val) : 0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    const token = user?.token;

    if (!token) {
      return alert("Unauthorized ❌ Please login again");
    }

    setLoading(true);

    const data = {
      name: form.name,
      description: form.description,
      category: form.category,
      price: num(form.price),

      // ✅ backend-friendly sizes
      sizes: {
        small: num(form.small),
        medium: num(form.medium),
        large: num(form.large),
      },

      discount: num(form.discount),
      deliveryCharge: num(form.deliveryCharge),
      image: form.image,
    };

    try {
      // ✅ endpoint consistency
      await axios.post(`${API}/food/add`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Food added successfully ✅");

      // reset form
      setForm({
        name: "",
        description: "",
        category: "",
        price: "",
        small: "",
        medium: "",
        large: "",
        discount: "",
        deliveryCharge: "",
        image: "",
      });

    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error adding food ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900">

      <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
        ➕ Add Food
      </h2>

      <form
        onSubmit={handleSubmit}
        className="grid gap-3 max-w-xl bg-white dark:bg-gray-800 p-6 rounded shadow"
      >

        <input
          name="name"
          placeholder="Food Name"
          value={form.name}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        {/* ✅ Category */}
        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          name="price"
          placeholder="Base Price"
          type="number"
          value={form.price}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />

        {/* ✅ Sizes */}
        <div className="grid grid-cols-3 gap-2">
          <input
            name="small"
            placeholder="Small"
            type="number"
            value={form.small}
            onChange={handleChange}
            className="p-2 border rounded"
          />

          <input
            name="medium"
            placeholder="Medium"
            type="number"
            value={form.medium}
            onChange={handleChange}
            className="p-2 border rounded"
          />

          <input
            name="large"
            placeholder="Large"
            type="number"
            value={form.large}
            onChange={handleChange}
            className="p-2 border rounded"
          />
        </div>

        <input
          name="discount"
          placeholder="Discount %"
          type="number"
          value={form.discount}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <input
          name="deliveryCharge"
          placeholder="Delivery Charge"
          type="number"
          value={form.deliveryCharge}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
        >
          {loading ? "Adding..." : "Add Food"}
        </button>

      </form>

    </div>
  );
};

export default AddFood;