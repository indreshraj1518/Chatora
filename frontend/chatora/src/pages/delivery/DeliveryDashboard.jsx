import { useEffect, useState } from "react";
import axios from "axios";

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);

  const token = JSON.parse(localStorage.getItem("user"))?.token;

  // 📦 FETCH ORDERS (ASSIGNED)
  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/order/delivery",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setOrders(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ ACCEPT ORDER
  const acceptOrder = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/order/accept/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  // ❌ REJECT ORDER
  const rejectOrder = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/order/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchOrders();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">

      <h1 className="text-2xl font-bold mb-4">
        🚚 Delivery Dashboard
      </h1>

      {orders.length === 0 && <p>No orders assigned</p>}

      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white dark:bg-gray-800 p-4 mb-4 rounded shadow"
        >

          <p>📍 Location: {order.location?.address}</p>

          <p>⏱ Time: {new Date(order.createdAt).toLocaleString()}</p>

          <p>💰 Delivery Charge: ₹{order.deliveryCharge || 0}</p>

          <p>Status: {order.status}</p>

          {/* ITEMS */}
          <div className="mt-2">
            {order.items.map((item, i) => (
              <p key={i}>
                🍔 {item.name} x {item.quantity}
              </p>
            ))}
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 mt-3">

            <button
              onClick={() => acceptOrder(order._id)}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              ✅ Accept
            </button>

            <button
              onClick={() => rejectOrder(order._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              ❌ Reject
            </button>

          </div>

        </div>
      ))}
    </div>
  );
};

export default DeliveryDashboard;