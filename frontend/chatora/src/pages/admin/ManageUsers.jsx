import { useEffect, useState } from "react";
import axios from "axios";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const token = JSON.parse(localStorage.getItem("user"))?.token;

  // 📦 Fetch users
  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:5000/api/user/all", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔄 Change Role
  const changeRole = async (id, role) => {
    await axios.put(
      `http://localhost:5000/api/user/${id}/role`,
      { role },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    alert("Role updated ✅");
    fetchUsers();
  };

  // ❌ Delete User
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    await axios.delete(`http://localhost:5000/api/user/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    alert("User deleted ✅");
    fetchUsers();
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-900 text-black dark:text-white">

      <h1 className="text-2xl font-bold mb-6">👥 Manage Users</h1>

      {users.map((user) => (
        <div
          key={user._id}
          className="bg-white dark:bg-gray-800 p-4 mb-4 rounded shadow flex justify-between items-center"
        >
          <div>
            <p className="font-bold">{user.name}</p>
            <p>{user.email}</p>
            <p className="text-sm">Role: {user.role}</p>
          </div>

          <div className="flex gap-2">

            {/* Change Role */}
            <select
              onChange={(e) => changeRole(user._id, e.target.value)}
              className="p-2 border rounded text-black"
              defaultValue={user.role}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="delivery">Delivery</option>
            </select>

            {/* Delete */}
            <button
              onClick={() => deleteUser(user._id)}
              className="bg-red-500 text-white px-3 py-1 rounded"
            >
              ❌ Delete
            </button>

          </div>
        </div>
      ))}

    </div>
  );
};

export default ManageUsers;