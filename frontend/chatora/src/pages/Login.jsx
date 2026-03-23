import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:5000/api";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔐 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ LOGIN VALIDATION
    if (isLogin) {
      if ((!form.email && !form.name) || !form.password) {
        return alert("Email/Username & Password required ❌");
      }
    }

    // ✅ SIGNUP VALIDATION
    if (!isLogin) {
      if (!form.name || !form.phone || !form.password) {
        return alert("Name, Phone & Password required ❌");
      }
    }

    setLoading(true);

    try {
      if (isLogin) {
        // 🔐 LOGIN (email OR name)
        const res = await axios.post(`${API}/user/login`, {
          email: form.email,
          name: form.name,
          password: form.password,
        });

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...res.data.user,
            token: res.data.token,
          })
        );

        alert("Login successful ✅");
        navigate("/");
      } else {
        // 📝 SIGNUP
        await axios.post(`${API}/user/signup`, {
          name: form.name,
          phone: form.phone,
          password: form.password,
          email: form.email,
        });

        alert("Signup successful ✅");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error ❌");
    }

    setLoading(false);
  };

  // 🔵 GOOGLE LOGIN / SIGNUP (DIRECT)
  const handleGoogleLogin = async () => {
    try {
      // ⚠️ Dummy अभी (Firebase बाद में)
      const fakeGoogleData = {
        email: "googleuser@gmail.com",
        name: "Google User",
      };

      const res = await axios.post(`${API}/auth/google`, fakeGoogleData);

      localStorage.setItem(
        "user",
        JSON.stringify({
          ...res.data.user,
          token: res.data.token,
        })
      );

      alert("Google Login success ✅");
      navigate("/");

    } catch {
      alert("Google login failed ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-80">

        <h2 className="text-2xl font-bold text-center mb-4">
          {isLogin ? "Sign In" : "Create Account"}
        </h2>

        {/* 🔵 GOOGLE */}
        <button
          onClick={handleGoogleLogin}
          className="w-full border py-2 rounded-lg mb-3"
        >
          🔵 Continue with Google
        </button>

        <p className="text-center text-gray-500 text-sm mb-2">or</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">

          {/* NAME (login + signup) */}
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Username"
            className="p-2 border rounded"
          />

          {/* EMAIL */}
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="p-2 border rounded"
          />

          {/* PHONE (only signup) */}
          {!isLogin && (
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="p-2 border rounded"
            />
          )}

          {/* PASSWORD */}
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            placeholder="Password"
            className="p-2 border rounded"
          />

          <button
            disabled={loading}
            className="bg-orange-500 text-white py-2 rounded"
          >
            {loading
              ? "Processing..."
              : isLogin
              ? "Sign In"
              : "Create Account"}
          </button>

        </form>

        {/* 🔁 TOGGLE */}
        <p className="text-sm mt-3 text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}

          <span
            onClick={() => setIsLogin(!isLogin)}
            className="text-orange-500 cursor-pointer ml-1"
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </span>
        </p>

      </div>
    </div>
  );
};

export default Login;