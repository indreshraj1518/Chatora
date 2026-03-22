import { useState, useEffect } from "react";
import axios from "axios";

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

  // fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await axios.get("http://localhost:5000/api/category/all");
      setCategories(res.data);
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = JSON.parse(localStorage.getItem("user"))?.token;

    const data = {
      name: form.name,
      description: form.description,
      category: form.category,
      price: Number(form.price),
      sizes: {
        small: Number(form.small),
        medium: Number(form.medium),
        large: Number(form.large),
      },
      discount: Number(form.discount),
      deliveryCharge: Number(form.deliveryCharge),
      image: form.image,
    };

    try {
      await axios.post(
        "http://localhost:5000/api/food/add",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Food added successfully ✅");

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
      alert("Error adding food ❌");
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

        {/* Category */}
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
          placeholder="Price"
          type="number"
          value={form.price}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />

        {/* Sizes */}
        <input
          name="small"
          placeholder="Small Price"
          type="number"
          value={form.small}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <input
          name="medium"
          placeholder="Medium Price"
          type="number"
          value={form.medium}
          onChange={handleChange}
          className="p-2 border rounded"
        />

        <input
          name="large"
          placeholder="Large Price"
          type="number"
          value={form.large}
          onChange={handleChange}
          className="p-2 border rounded"
        />

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
          className="bg-orange-500 text-white py-2 rounded"
        >
          Add Food
        </button>

      </form>

    </div>
  );
};

export default AddFood;