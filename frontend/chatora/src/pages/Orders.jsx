import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (!token) {
          alert("Please login first ❌");
          return;
        }

        const res = await axios.get(`${API}/order/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // ✅ FIXED
        setOrders(res.data.data || res.data || []);

      } catch (err) {
        console.log("Order fetch error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // 🎨 status color
  const getStatusColor = (status) => {
    if (status === "pending") return "text-yellow-500";
    if (status === "assigned") return "text-blue-500";
    if (status === "out_for_delivery") return "text-purple-500";
    if (status === "delivered") return "text-green-500";
    if (status === "cancelled") return "text-red-500";
    return "text-gray-500";
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">

      <h1 className="text-3xl font-bold mb-6">📦 My Orders</h1>

      {loading ? (
        <p className="text-center">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-gray-500">
          No orders yet 😔
        </p>
      ) : (
        <div className="space-y-4">

          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow"
            >

              {/* Header */}
              <div className="flex justify-between flex-col md:flex-row">

                <h2 className="font-semibold text-lg">
                  Order ID: {order._id}
                </h2>

                <span className={`font-semibold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>

              </div>

              {/* 📍 Address */}
              <p className="text-sm mt-2 text-gray-500">
                📍 {order.location?.address || "No address"}
              </p>

              {/* 🍔 Items */}
              <div className="mt-3">
                {order.items?.map((item, i) => (
                  <p key={i} className="text-sm text-gray-600 dark:text-gray-300">
                    {item.name} × {item.quantity} ({item.size})
                  </p>
                ))}
              </div>

              {/* 💰 Footer */}
              <div className="mt-3 flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{order.totalPrice}</span>
              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default Orders;