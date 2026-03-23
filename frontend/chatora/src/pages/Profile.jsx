import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const Profile = () => {
  const userData = JSON.parse(localStorage.getItem("user"));
  const token = userData?.token;

  const [activeTab, setActiveTab] = useState("name");

  const [form, setForm] = useState({
    name: userData?.name || "",
    email: userData?.email || "",
    phone: userData?.phone || "",
    address: userData?.address || "",
    notifications: true,
  });

  const [image, setImage] = useState(userData?.image || "");
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
  });

  // 🔄 handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 💾 Save profile
  const handleSave = async () => {
    try {
      const res = await axios.put(
        `${API}/user/update`,
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      localStorage.setItem("user", JSON.stringify(res.data));
      alert("Profile updated ✅");

    } catch (err) {
      alert("Error updating ❌");
    }
  };

  // 🖼️ Image upload
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.put(
        `${API}/user/upload-profile`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setImage(res.data.image);

    } catch {
      alert("Upload failed ❌");
    }
  };

  // 🔐 Change password
  const changePassword = async () => {
    try {
      await axios.put(
        `${API}/user/change-password`,
        password,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Password changed ✅");

    } catch {
      alert("Wrong password ❌");
    }
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-black dark:text-white">

      {/* 🔹 LEFT SIDEBAR */}
      <div className="w-1/4 bg-white dark:bg-gray-800 p-6 space-y-4">

        {/* 👤 Profile Image */}
        <div className="flex flex-col items-center">
          <img
            src={
              image
                ? `http://localhost:5000/uploads/${image}`
                : "https://via.placeholder.com/100"
            }
            className="w-24 h-24 rounded-full object-cover"
          />
          <input type="file" onChange={handleImageUpload} className="mt-2" />
        </div>

        <hr />

        <p onClick={() => setActiveTab("name")} className="cursor-pointer">Name</p>
        <p onClick={() => setActiveTab("email")} className="cursor-pointer">Email</p>
        <p onClick={() => setActiveTab("phone")} className="cursor-pointer">Phone</p>
        <p onClick={() => setActiveTab("address")} className="cursor-pointer">Address</p>
        <p onClick={() => setActiveTab("notification")} className="cursor-pointer">Notification</p>
        <p onClick={() => setActiveTab("password")} className="cursor-pointer">Change Password</p>

        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded mt-4"
        >
          Logout
        </button>
      </div>

      {/* 🔸 RIGHT CONTENT */}
      <div className="w-3/4 p-8">

        {/* NAME */}
        {activeTab === "name" && (
          <>
            <h2 className="text-xl mb-4">Edit Name</h2>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="border p-2 w-full mb-3 text-black"
            />
            <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
              Save
            </button>
          </>
        )}

        {/* EMAIL */}
        {activeTab === "email" && (
          <>
            <h2 className="text-xl mb-4">Edit Email</h2>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              className="border p-2 w-full mb-3 text-black"
            />
            <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
              Save
            </button>
          </>
        )}

        {/* PHONE */}
        {activeTab === "phone" && (
          <>
            <h2 className="text-xl mb-4">Edit Phone</h2>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="border p-2 w-full mb-3 text-black"
            />
            <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
              Save
            </button>
          </>
        )}

        {/* ADDRESS */}
        {activeTab === "address" && (
          <>
            <h2 className="text-xl mb-4">Edit Address</h2>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="border p-2 w-full mb-3 text-black"
            />
            <button onClick={handleSave} className="bg-green-500 text-white px-4 py-2 rounded">
              Save
            </button>
          </>
        )}

        {/* NOTIFICATION */}
        {activeTab === "notification" && (
          <>
            <h2 className="text-xl mb-4">Notifications</h2>
            <button
              onClick={() =>
                setForm({ ...form, notifications: !form.notifications })
              }
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {form.notifications ? "ON" : "OFF"}
            </button>
          </>
        )}

        {/* PASSWORD */}
        {activeTab === "password" && (
          <>
            <h2 className="text-xl mb-4">Change Password</h2>

            <input
              type="password"
              placeholder="Old Password"
              onChange={(e) =>
                setPassword({ ...password, oldPassword: e.target.value })
              }
              className="border p-2 w-full mb-3 text-black"
            />

            <input
              type="password"
              placeholder="New Password"
              onChange={(e) =>
                setPassword({ ...password, newPassword: e.target.value })
              }
              className="border p-2 w-full mb-3 text-black"
            />

            <button onClick={changePassword} className="bg-green-500 text-white px-4 py-2 rounded">
              Update Password
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default Profile;