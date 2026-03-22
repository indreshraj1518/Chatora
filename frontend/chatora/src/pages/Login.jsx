import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        // LOGIN API
        const res = await axios.post("http://localhost:5000/api/user/login", {
          email: form.email,
          password: form.password,
        });

        console.log("LOGIN RESPONSE:", res.data); // DEBUG

        // // ✅ SAVE TOKEN
         localStorage.setItem("token", res.data.token);

        // // ✅ SAVE USER (VERY IMPORTANT)
         localStorage.setItem("user", JSON.stringify(res.data.user));
        // localStorage.setItem("user", JSON.stringify(res.data.user));
        // localStorage.setItem("token", res.data.token);

        alert("Login successful ✅");

        navigate("/");
      } else {
        // SIGNUP API
        await axios.post("http://localhost:5000/api/user/signup", form);

        alert("Signup successful ✅");

        setIsLogin(true);
      }
    } catch (err) {
      console.log("ERROR:", err.response?.data || err.message);

      alert(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-80 border dark:border-gray-700">

        <h2 className="text-2xl font-bold text-center mb-4 text-gray-800 dark:text-white">
          {isLogin ? "Login" : "Signup"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          {!isLogin && (
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              type="text"
              placeholder="Name"
              className="p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
            />
          )}

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="Email"
            className="p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
          />

          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            className="p-2 border rounded bg-white dark:bg-gray-700 text-black dark:text-white border-gray-300 dark:border-gray-600"
          />

          <button
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600 text-white py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Processing..." : isLogin ? "Login" : "Signup"}
          </button>

        </form>

        {/* Toggle */}
        <p className="text-sm mt-3 text-center text-gray-700 dark:text-gray-300">
          {isLogin ? "Don't have an account?" : "Already have an account?"}

          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-orange-500 cursor-pointer ml-1 font-semibold"
          >
            {isLogin ? "Signup" : "Login"}
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;