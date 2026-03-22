import { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);

  // ✅ सही token
  const token = localStorage.getItem("token");

  // 📦 Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/order/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ crash safe
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("Order Fetch Error:", err.response?.data || err.message);
    }
  };

  // 🚚 Fetch Delivery Boys
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

      setDeliveryBoys(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.log("Delivery Boy Error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    if (!token) {
      alert("Please login first ❌");
      return;
    }

    fetchOrders();
    fetchDeliveryBoys();
  }, []);

  // 🚚 Assign Delivery Boy
  const assignDelivery = async (orderId, deliveryBoyId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/order/assign/${orderId}`,
        { deliveryBoyId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Delivery boy assigned ✅");
      fetchOrders();
    } catch (err) {
      console.log("Assign Error:", err.response?.data || err.message);
    }
  };

  // 🔄 Status Update
  const updateStatus = async (orderId, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/order/status/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Status updated ✅");
      fetchOrders();
    } catch (err) {
      console.log("Status Error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">

      <h1 className="text-2xl font-bold mb-6">📦 Orders Management</h1>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="bg-white dark:bg-gray-800 p-4 mb-4 rounded shadow"
          >
            <p><b>Order ID:</b> {order._id}</p>
            <p><b>Total:</b> ₹{order.totalPrice}</p>
            <p><b>Status:</b> {order.status}</p>

            {/* 🍔 Items */}
            <div className="mt-2">
              <b>Items:</b>
              {order.items?.map((item, i) => (
                <p key={i}>
                  {item.name} x {item.quantity} ({item.size})
                </p>
              ))}
            </div>

            {/* 🚚 Assign Delivery Boy */}
            <div className="mt-3">
              <select
                onChange={(e) =>
                  assignDelivery(order._id, e.target.value)
                }
                className="p-2 border rounded text-black"
              >
                <option value="">Select Delivery Boy</option>

                {deliveryBoys.map((boy) => (
                  <option key={boy._id} value={boy._id}>
                    {boy.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 🔄 Status Update */}
            <div className="mt-3 flex gap-2 flex-wrap">
              <button
                onClick={() => updateStatus(order._id, "assigned")}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Assigned
              </button>

              <button
                onClick={() =>
                  updateStatus(order._id, "out_for_delivery")
                }
                className="bg-yellow-500 text-white px-3 py-1 rounded"
              >
                Out for Delivery
              </button>

              <button
                onClick={() => updateStatus(order._id, "delivered")}
                className="bg-green-500 text-white px-3 py-1 rounded"
              >
                Delivered
              </button>
            </div>

          </div>
        ))
      )}

    </div>
  );
};

export default AdminOrders;