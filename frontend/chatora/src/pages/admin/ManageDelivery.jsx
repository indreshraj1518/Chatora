import { useEffect, useState } from "react";
import axios from "axios";

const ManageDelivery = () => {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  // 📦 FETCH DELIVERY BOYS (LIST)
  const fetchDeliveryBoys = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/user/delivery-boys",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setDeliveryBoys(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
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
      alert("Fill all fields");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/user/add-delivery",
        {
          ...form,
          role: "delivery",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Delivery boy added ✅");

      setForm({
        name: "",
        email: "",
        password: "",
      });

      fetchDeliveryBoys(); // refresh list

    } catch (err) {
      console.log(err);
      alert("Error adding delivery boy ❌");
    }
  };

  // ❌ DELETE DELIVERY BOY
  const deleteDeliveryBoy = async (id) => {
    if (!window.confirm("Delete this delivery boy?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Deleted ✅");

      fetchDeliveryBoys(); // refresh list

    } catch (err) {
      console.log(err);
      alert("Error deleting ❌");
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

        <button className="bg-green-500 text-white py-2 rounded">
          ➕ Add Delivery Boy
        </button>
      </form>

      {/* 📋 DELIVERY BOY LIST */}
      <div className="grid gap-4">

        {deliveryBoys.length === 0 && (
          <p>No delivery boys found</p>
        )}

        {deliveryBoys.map((boy) => (
          <div
            key={boy._id}
            className="bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{boy.name}</p>
              <p>{boy.email}</p>
            </div>

            <button
              onClick={() => deleteDeliveryBoy(boy._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              ❌ Delete
            </button>
          </div>
        ))}

      </div>

    </div>
  );
};

export default ManageDelivery;