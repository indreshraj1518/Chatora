import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
  const [menu, setMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [dark, setDark] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();

  // ✅ Safe user parse
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  })();

  // 🛒 Cart count
  useEffect(() => {
    const updateCart = () => {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
      setCartCount(totalQty);
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

  // 🔐 Logout
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ❌ Close dropdown on outside click
  useEffect(() => {
    const close = () => setProfileOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

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

        {/* 💻 Desktop */}
        <div className="hidden md:flex items-center gap-6">

          {/* 🌙 Theme */}
          <button
            onClick={toggleTheme}
            className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
          >
            {dark ? "☀️" : "🌙"}
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

          {/* 🚚 Delivery */}
          {user?.role === "delivery" && (
            <button
              onClick={() => navigate("/delivery/dashboard")}
              className="text-blue-500 font-semibold"
            >
              🚚 Delivery
            </button>
          )}

          {/* 👑 Admin */}
          {user?.role === "admin" && (
            <button
              onClick={() => navigate("/admin")}
              className="bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800"
            >
              👑 Admin
            </button>
          )}

          {/* 👤 PROFILE */}
          {!user ? (
            <Link
              to="/login"
              className="bg-orange-500 text-white px-4 py-1 rounded-lg hover:bg-orange-600"
            >
              Sign In
            </Link>
          ) : (
            <div
              className="relative"
              onClick={(e) => e.stopPropagation()} // 🔥 prevent auto close
            >
              {/* Profile Icon */}
              <div
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center cursor-pointer font-bold"
              >
                {user.name?.charAt(0).toUpperCase()}
              </div>

              {/* Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 z-50">

                  <button
                    onClick={() => {
                      navigate("/profile");
                      setProfileOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                  >
                    👤 My Profile
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setProfileOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 hover:bg-red-100 dark:hover:bg-red-700 rounded text-red-500"
                  >
                    🚪 Logout
                  </button>

                </div>
              )}
            </div>
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

              {user?.role === "delivery" && (
                <button
                  onClick={() => {
                    navigate("/delivery/dashboard");
                    setMenu(false);
                  }}
                >
                  🚚 Delivery
                </button>
              )}

              {user?.role === "admin" && (
                <button
                  onClick={() => {
                    navigate("/admin");
                    setMenu(false);
                  }}
                >
                  👑 Admin
                </button>
              )}

              <button
                onClick={() => {
                  navigate("/profile");
                  setMenu(false);
                }}
              >
                👤 My Profile
              </button>

              <button
                onClick={() => {
                  logout();
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
              Sign In
            </Link>
          )}

        </div>
      )}
    </nav>
  );
};

export default Navbar;