import { useEffect, useState } from "react";
import axios from "axios";

const API = "http://localhost:5000/api";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));
  const token = currentUser?.token;

  // 📦 Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API}/user/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(res.data.data || []);

    } catch (err) {
      console.log("Fetch error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      alert("Unauthorized ❌");
      return;
    }

    fetchUsers();
  }, []);

  // 🔄 Change Role
  const changeRole = async (id, role) => {
    try {
      await axios.put(
        `${API}/user/update-role/${id}`, // ✅ fixed endpoint
        { role },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Role updated ✅");
      fetchUsers();

    } catch (err) {
      console.log("Role error:", err.response?.data || err.message);
      alert("Error updating role ❌");
    }
  };

  // ❌ Delete User
  const deleteUser = async (id) => {
    if (currentUser?._id === id) {
      return alert("You can't delete yourself ❌");
    }

    if (!window.confirm("Delete this user?")) return;

    try {
      await axios.delete(`${API}/user/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("User deleted ✅");
      fetchUsers();

    } catch (err) {
      console.log("Delete error:", err.response?.data || err.message);
      alert("Error deleting ❌");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">

      <h1 className="text-2xl font-bold mb-6">👥 Manage Users</h1>

      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <div className="grid gap-4">

          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{user.name}</p>
                <p>{user.email}</p>

                {/* ✅ Role */}
                <p className="text-sm">
                  Role:{" "}
                  <span className="font-semibold text-orange-500">
                    {user.role}
                  </span>
                </p>

                {/* ✅ Delivery status */}
                {user.role === "delivery" && (
                  <p className={`text-sm ${
                    user.isAvailable ? "text-green-500" : "text-red-500"
                  }`}>
                    {user.isAvailable ? "Available" : "Busy"}
                  </p>
                )}
              </div>

              <div className="flex gap-2">

                {/* 🔄 Change Role */}
                <select
                  onChange={(e) => changeRole(user._id, e.target.value)}
                  className="p-2 border rounded text-black"
                  defaultValue={user.role}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="delivery">Delivery</option>
                </select>

                {/* ❌ Delete */}
                <button
                  onClick={() => deleteUser(user._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  ❌
                </button>

              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default ManageUsers;