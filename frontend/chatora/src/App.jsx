import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import FoodDetails from "./pages/FoodDetails";

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";  
import AddFood from "./pages/admin/AddFood";
import AdminOrders from "./pages/admin/AdminOrders";
import ManageFood from "./pages/admin/ManageFood";
import ManageCategory from "./pages/admin/ManageCategory";
import ManageUsers from "./pages/admin/ManageUsers";
import DeliveryDashboard from "./pages/delivery/DeliveryDashboard";
import ManageDelivery from "./pages/admin/ManageDelivery";

function App() {

  // 🌙 Theme load on app start
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light") {
    document.documentElement.classList.remove("dark");
  } else {
    document.documentElement.classList.add("dark");
  }

  return (
    <BrowserRouter>

      {/* 🌐 Navbar */}
      <Navbar />

      {/* 📄 Routes */}
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* 🔐 Protected Routes */}
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
    <PrivateRoute>
      <AddFood />
    </PrivateRoute>
  }
/>
<Route
  path="/admin/orders"
  element={
    <PrivateRoute>
      <AdminOrders />
    </PrivateRoute>
  }
/>
<Route
  path="/admin/manage-food"
  element={
    <PrivateRoute>
      <ManageFood />
    </PrivateRoute>
  }
/>
<Route
  path="/admin/categories"
  element={
    <PrivateRoute>
      <ManageCategory />
    </PrivateRoute>
  }
/>
<Route
  path="/admin/users"
  element={
    <PrivateRoute>
      <ManageUsers />
    </PrivateRoute>
  }
/>
<Route
  path="/delivery"
  element={
    <PrivateRoute>
      <DeliveryDashboard />
    </PrivateRoute>
  }
/>
<Route
  path="/admin/delivery-boys"
  element={
    <PrivateRoute>
      <ManageDelivery />
    </PrivateRoute>
  }
/>
        <Route path="/food/:id" element={<FoodDetails />} />

      </Routes>

      {/* 🔔 Toast */}
      <ToastContainer />

    </BrowserRouter>
  );
}

export default App;