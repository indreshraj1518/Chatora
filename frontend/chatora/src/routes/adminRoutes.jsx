import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    foods: 0,
    categories: 0,
    pendingOrders: 0,
  });

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  // 📊 FETCH STATS
  const fetchStats = async () => {
    try {
      const [usersRes, ordersRes, foodsRes, catRes] =
        await Promise.all([
          axios.get(`${API}/user/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API}/order/all`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API}/food/all`),
          axios.get(`${API}/category/all`),
        ]);

      const orders = ordersRes.data || [];
      
      setStats({
        users: usersRes.data?.length || 0,
        orders: orders.length || 0,
        foods: foodsRes.data?.length || 0,
        categories: catRes.data?.length || 0,
        pendingOrders: orders.filter(o => o.status === "pending").length,
      });

    } catch (err) {
      console.log("Dashboard error:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 text-black dark:text-white">

      <h1 className="text-3xl font-bold mb-8">👑 Admin Dashboard</h1>

      {/* 📊 STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
          <h2 className="text-xl font-bold">{stats.users}</h2>
          <p>Users</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
          <h2 className="text-xl font-bold">{stats.orders}</h2>
          <p>Orders</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
          <h2 className="text-xl font-bold">{stats.foods}</h2>
          <p>Foods</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow text-center">
          <h2 className="text-xl font-bold">{stats.categories}</h2>
          <p>Categories</p>
        </div>

        <div className="bg-yellow-400 text-black p-4 rounded shadow text-center">
          <h2 className="text-xl font-bold">{stats.pendingOrders}</h2>
          <p>Pending</p>
        </div>

      </div>

      {/* ⚡ QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Link to="/admin/orders" className="card">
          📦 Orders <p>Manage & assign delivery</p>
        </Link>

        <Link to="/admin/add-food" className="card">
          🍔 Add Food <p>Create new food item</p>
        </Link>

        <Link to="/admin/manage-food" className="card">
          📝 Manage Food <p>Edit/Delete food</p>
        </Link>

        <Link to="/admin/categories" className="card">
          📂 Categories <p>Manage categories</p>
        </Link>

        <Link to="/admin/users" className="card">
          👥 Users <p>Manage users</p>
        </Link>

        <Link to="/admin/delivery-boys" className="card">
          🚚 Delivery <p>Manage delivery boys</p>
        </Link>

      </div>

    </div>
  );
};

export default AdminDashboard;