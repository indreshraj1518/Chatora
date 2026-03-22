import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  // 📦 FETCH ASSIGNED ORDERS
  const fetchOrders = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/order/delivery`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // ✅ fix response
      setOrders(res.data.data || []);

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

    fetchOrders();
  }, []);

  // ✅ ACCEPT ORDER
  const acceptOrder = async (id) => {
    try {
      await axios.put(
        `${API}/order/accept/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order accepted ✅");
      fetchOrders();

    } catch (err) {
      console.log("Accept error:", err.response?.data || err.message);
    }
  };

  // ❌ REJECT ORDER
  const rejectOrder = async (id) => {
    if (!window.confirm("Reject this order?")) return;

    try {
      await axios.put(
        `${API}/order/reject/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order rejected ❌");
      fetchOrders();

    } catch (err) {
      console.log("Reject error:", err.response?.data || err.message);
    }
  };

  // 🔄 MARK DELIVERED (🔥 IMPORTANT)
  const markDelivered = async (id) => {
    try {
      await axios.put(
        `${API}/order/status/${id}`,
        { status: "delivered" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Order delivered 🎉");
      fetchOrders();

    } catch (err) {
      console.log("Delivery error:", err.response?.data || err.message);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">

      <h1 className="text-2xl font-bold mb-4">
        🚚 Delivery Dashboard
      </h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No orders assigned</p>
      ) : (
        <div className="grid gap-4">

          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow"
            >

              <p><b>📍 Location:</b> {order.location?.address || "N/A"}</p>

              <p>
                <b>⏱ Time:</b>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>

              <p><b>💰 Delivery Charge:</b> ₹{order.deliveryCharge || 0}</p>

              <p>
                <b>Status:</b>{" "}
                <span className="text-orange-500 font-semibold">
                  {order.status}
                </span>
              </p>

              {/* 🍔 ITEMS */}
              <div className="mt-2">
                <b>Items:</b>
                {order.items?.map((item, i) => (
                  <p key={i}>
                    🍔 {item.name} x {item.quantity}
                  </p>
                ))}
              </div>

              {/* 🔘 ACTION BUTTONS */}
              <div className="flex gap-2 mt-3 flex-wrap">

                {/* Accept only if assigned */}
                {order.status === "assigned" && (
                  <button
                    onClick={() => acceptOrder(order._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    ✅ Accept
                  </button>
                )}

                {/* Reject only if assigned */}
                {order.status === "assigned" && (
                  <button
                    onClick={() => rejectOrder(order._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    ❌ Reject
                  </button>
                )}

                {/* Mark delivered */}
                {order.status === "out_for_delivery" && (
                  <button
                    onClick={() => markDelivered(order._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    📦 Mark Delivered
                  </button>
                )}

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;