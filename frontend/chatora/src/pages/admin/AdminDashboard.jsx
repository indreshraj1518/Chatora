import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6 text-gray-900 dark:text-white">

      <h1 className="text-3xl font-bold mb-8">👑 Admin Dashboard</h1>

      {/* 🔥 Quick Stats Row (NEW - backend ready) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Orders</p>
          <h2 className="text-xl font-bold">--</h2>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Foods</p>
          <h2 className="text-xl font-bold">--</h2>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Users</p>
          <h2 className="text-xl font-bold">--</h2>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Delivery Boys</p>
          <h2 className="text-xl font-bold">--</h2>
        </div>

      </div>

      {/* 🧩 Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* 📦 Orders (IMPORTANT - backend flow main) */}
        <Link
          to="/admin/orders"
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">📦 Orders</h2>
          <p>View orders, update status & assign delivery</p>
        </Link>

        {/* 🚚 Delivery Control (UPDATED) */}
        <Link
          to="/admin/delivery-boys"
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">🚚 Delivery Control</h2>
          <p>Manage delivery boys & availability</p>
        </Link>

        {/* 👥 Users (ROLE BASED - backend match) */}
        <Link
          to="/admin/users"
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">👥 Users</h2>
          <p>Manage users & roles (user/admin/delivery)</p>
        </Link>

        {/* 🍔 Add Food */}
        <Link
          to="/admin/add-food"
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">🍔 Add Food</h2>
          <p>Create new food item</p>
        </Link>

        {/* 📝 Manage Food */}
        <Link
          to="/admin/manage-food"
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">📝 Manage Food</h2>
          <p>Edit / delete food items</p>
        </Link>

        {/* 📂 Categories (ROUTE FIXED) */}
        <Link
          to="/admin/categories"
          className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition"
        >
          <h2 className="text-xl font-semibold">📂 Categories</h2>
          <p>Add / delete categories</p>
        </Link>

      </div>

    </div>
  );
};

export default AdminDashboard;