import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const ManageDelivery = () => {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  // 📦 FETCH DELIVERY BOYS
  const fetchDeliveryBoys = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/user/delivery-boys`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setDeliveryBoys(res.data.data || []);

    } catch (err) {
      console.log("Fetch error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      alert("Unauthorized ❌");
      return;
    }
    fetchDeliveryBoys();
  }, []);

  // ➕ INPUT CHANGE
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ➕ ADD DELIVERY BOY
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return alert("Fill all fields ❌");
    }

    try {
      await axios.post(
        `${API}/user/add-delivery`,
        {
          ...form,
          role: "delivery",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Delivery boy added ✅");

      setForm({
        name: "",
        email: "",
        password: "",
      });

      fetchDeliveryBoys();

    } catch (err) {
      console.log("Add error:", err.response?.data || err.message);
      alert("Error adding delivery boy ❌");
    }
  };

  // ❌ DELETE DELIVERY BOY
  const deleteDeliveryBoy = async (id) => {
    if (!window.confirm("Delete this delivery boy?")) return;

    try {
      await axios.delete(`${API}/user/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Deleted ✅");
      fetchDeliveryBoys();

    } catch (err) {
      console.log("Delete error:", err.response?.data || err.message);
      alert("Error deleting ❌");
    }
  };

  // 🔄 TOGGLE AVAILABILITY (🔥 IMPORTANT FEATURE)
  const toggleAvailability = async (id, currentStatus) => {
    try {
      await axios.put(
        `${API}/user/toggle-availability/${id}`,
        { isAvailable: !currentStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchDeliveryBoys();

    } catch (err) {
      console.log("Toggle error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">

      <h1 className="text-2xl font-bold mb-6">
        🚚 Manage Delivery Boys
      </h1>

      {/* ➕ ADD FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-4 mb-6 rounded shadow max-w-md flex flex-col gap-3"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="p-2 border rounded text-black"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="p-2 border rounded text-black"
        />

        <input
          name="password"
          value={form.password}
          onChange={handleChange}
          type="password"
          placeholder="Password"
          className="p-2 border rounded text-black"
        />

        <button className="bg-green-500 text-white py-2 rounded hover:bg-green-600">
          ➕ Add Delivery Boy
        </button>
      </form>

      {/* 📋 LIST */}
      {loading ? (
        <p>Loading...</p>
      ) : deliveryBoys.length === 0 ? (
        <p>No delivery boys found</p>
      ) : (
        <div className="grid gap-4">

          {deliveryBoys.map((boy) => (
            <div
              key={boy._id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{boy.name}</p>
                <p>{boy.email}</p>

                {/* ✅ Availability Status */}
                <p className={`text-sm ${
                  boy.isAvailable ? "text-green-500" : "text-red-500"
                }`}>
                  {boy.isAvailable ? "Available" : "Busy"}
                </p>
              </div>

              <div className="flex gap-2">

                {/* 🔄 Toggle */}
                <button
                  onClick={() =>
                    toggleAvailability(boy._id, boy.isAvailable)
                  }
                  className="bg-blue-500 text-white px-3 py-1 rounded"
                >
                  Toggle
                </button>

                {/* ❌ Delete */}
                <button
                  onClick={() => deleteDeliveryBoy(boy._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  ❌
                </button>

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default ManageDelivery;