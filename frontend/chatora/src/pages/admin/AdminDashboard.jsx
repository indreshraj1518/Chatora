import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 text-gray-900 dark:text-white">

      <h1 className="text-3xl font-bold mb-8">👑 Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* 📦 Orders */}
        <Link
          to="/admin/orders"
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">📦 Orders</h2>
          <p>Manage orders & assign delivery boy</p>
        </Link>

        {/* 🍔 Add Food */}
        <Link
          to="/admin/add-food"
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">🍔 Add Food</h2>
          <p>Add new food items</p>
        </Link>

        {/* 📝 Manage Food */}
        <Link
          to="/admin/manage-food"
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">📝 Manage Food</h2>
          <p>Edit / delete food items</p>
        </Link>

        {/* 📂 Category */}
        <Link
          to="/admin/categories"
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">📂 Categories</h2>
          <p>Add / delete categories</p>
        </Link>

        {/* 👥 Users */}
        <Link
          to="/admin/users"
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">👥 Users</h2>
          <p>View & manage users</p>
        </Link>

        {/* 🚚 Delivery Boys */}
        <Link
          to="/admin/delivery-boys"
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">🚚 Delivery Boys</h2>
          <p>Add & manage delivery staff</p>
        </Link>

      </div>

    </div>
  );
};

export default AdminDashboard;