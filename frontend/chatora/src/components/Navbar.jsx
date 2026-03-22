import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [dark, setDark] = useState(false);

  const navigate = useNavigate();

  // 👤 Safe user
  const user = (() => {
    try {
      const data = localStorage.getItem("user");
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  })();

  // 🛒 Cart count
  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartCount(cart.length);
    };

    updateCart();
    window.addEventListener("storage", updateCart);

    return () => window.removeEventListener("storage", updateCart);
  }, []);

  // 🌙 Theme load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setDark(true);
    }
  }, []);

  // 🌗 Toggle theme
  const toggleTheme = () => {
    const isDark = document.documentElement.classList.contains("dark");

    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDark(true);
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-lg sticky top-0 z-50 border-b dark:border-gray-700">

      <div className="flex justify-between items-center px-6 py-4">

        {/* 🍔 Logo */}
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold cursor-pointer text-orange-500"
        >
          🍔 Chatora
        </h1>

        {/* 💻 Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">

          {/* 🌙 Theme */}
          <button
            onClick={toggleTheme}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>

          {/* 🛒 Cart */}
          {user && (
            <div
              onClick={() => navigate("/cart")}
              className="relative cursor-pointer"
            >
              <FaShoppingCart size={22} />

              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
          )}

          {/* 📦 Orders */}
          {user && (
            <Link to="/orders" className="hover:text-orange-500">
              Orders
            </Link>
          )}

          {/* 👑 ADMIN BUTTON (IMPORTANT) */}
          {user?.role?.toLowerCase() === "admin" && (
            <button
              onClick={() => navigate("/admin")}
              className="bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800 transition"
            >
              👑 Admin
            </button>
          )}

          {/* 🔐 AUTH */}
          {!user ? (
            <Link
              to="/login"
              className="bg-orange-500 text-white px-4 py-1 rounded-lg font-semibold hover:bg-orange-600 transition"
            >
              Login
            </Link>
          ) : (
            <button
              onClick={() => {
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                navigate("/login");
              }}
              className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          )}
        </div>

        {/* 📱 Mobile Toggle */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenu(!menu)}
        >
          ☰
        </button>
      </div>

      {/* 📱 Mobile Menu */}
      {menu && (
        <div className="md:hidden flex flex-col items-center gap-4 py-4 bg-white dark:bg-gray-900 border-t dark:border-gray-700">

          <button onClick={toggleTheme}>
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>

          {user && (
            <>
              <Link to="/cart" onClick={() => setMenu(false)}>
                Cart ({cartCount})
              </Link>

              <Link to="/orders" onClick={() => setMenu(false)}>
                Orders
              </Link>
               {/* DELIVERY BOY ICON */}
        {user?.role === "delivery" && (
          <button
            onClick={() => navigate("/delivery/dashboard")}
            className="text-blue-500 font-semibold"
          >
            🚚 Delivery
          </button>
        )}

              {user?.role?.toLowerCase() === "admin" && (
                <button
                  onClick={() => {
                    navigate("/admin");
                    setMenu(false);
                  }}
                  className="bg-black text-white px-3 py-1 rounded"
                >
                  👑 Admin
                </button>
              )}

              <button
                onClick={() => {
                  localStorage.removeItem("user");
                  localStorage.removeItem("token");
                  navigate("/login");
                  setMenu(false);
                }}
                className="bg-red-500 text-white px-4 py-1 rounded"
              >
                Logout
              </button>
            </>
          )}

          {!user && (
            <Link to="/login" onClick={() => setMenu(false)}>
              Login
            </Link>
          )}

        </div>
      )}
    </nav>
  );
};

export default Navbar;