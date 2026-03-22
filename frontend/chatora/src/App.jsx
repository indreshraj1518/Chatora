import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import FoodDetails from "./pages/FoodDetails";

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import DeliveryRoute from "./components/DeliveryRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ ADMIN PAGES
import AdminDashboard from "./pages/admin/AdminDashboard";
import AddFood from "./pages/admin/AddFood";
import AdminOrders from "./pages/admin/AdminOrders";
import ManageFood from "./pages/admin/ManageFood";
import ManageCategory from "./pages/admin/ManageCategory";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageDelivery from "./pages/admin/ManageDelivery";

// ✅ DELIVERY
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";

function App() {

  // 🌙 Theme load FIXED
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <BrowserRouter>

      {/* 🌐 Navbar */}
      <Navbar />

      <Routes>

        {/* 🌍 PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/food/:id" element={<FoodDetails />} />

        {/* 🔐 USER ROUTES */}
        <Route
          path="/cart"
          element={
            <PrivateRoute>
              <Cart />
            </PrivateRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />

        {/* 👑 ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/add-food"
          element={
            <AdminRoute>
              <AddFood />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/manage-food"
          element={
            <AdminRoute>
              <ManageFood />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <AdminRoute>
              <ManageCategory />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <ManageUsers />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/delivery-boys"
          element={
            <AdminRoute>
              <ManageDelivery />
            </AdminRoute>
          }
        />

        {/* 🚚 DELIVERY ROUTES */}
        <Route
          path="/delivery/dashboard"
          element={
            <DeliveryRoute>
              <DeliveryDashboard />
            </DeliveryRoute>
          }
        />

        {/* ❌ 404 FALLBACK */}
        <Route
          path="*"
          element={
            <div className="p-10 text-center text-xl">
              404 | Page Not Found
            </div>
          }
        />

      </Routes>

      {/* 🔔 Toast */}
      <ToastContainer position="top-right" autoClose={2000} />

    </BrowserRouter>
  );
}

export default App;