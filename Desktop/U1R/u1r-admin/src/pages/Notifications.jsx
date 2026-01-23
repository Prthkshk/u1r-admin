import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, CheckCircle } from "lucide-react";
import { API_BASE } from "../config/api";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [users, setUsers] = useState([]);

  const [data, setData] = useState({
    userId: "",
    message: "",
    type: "general"
  });

  // FETCH NOTIFICATIONS
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(`${API_BASE}/api/admin/notifications`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(res.data);
    } catch (error) {
      console.log("Fetch notifications error:", error);
    }
  };

  // FETCH USERS (only B2C users for now)
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(`${API_BASE}/api/admin/users/b2c`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data);
    } catch (error) {
      console.log("Fetch users error:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUsers();
  }, []);

  // SEND NOTIFICATION
  const handleAdd = async () => {
    if (!data.userId || !data.message.trim()) {
      alert("All fields required");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");

      await axios.post(`${API_BASE}/api/admin/notifications`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Notification sent!");
      setData({ userId: "", message: "", type: "general" });
      fetchNotifications();

    } catch (error) {
      console.log("Add notification error:", error);
    }
  };

  // MARK AS READ
  const markRead = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");

      await axios.put(
        `${API_BASE}/api/admin/notifications/read/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchNotifications();
    } catch (error) {
      console.log("Mark read error:", error);
    }
  };

  // DELETE NOTIFICATION
  const handleDelete = async (id) => {
    if (!confirm("Delete notification?")) return;

    try {
      const token = localStorage.getItem("adminToken");

      await axios.delete(
        `${API_BASE}/api/admin/notifications/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchNotifications();
    } catch (error) {
      console.log("Delete notification error:", error);
    }
  };

  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="w-full bg-red-500 text-white p-6 rounded-b-xl mb-6">
        <h1 className="text-4xl font-bold heading-font">NOTIFICATIONS</h1>
      </div>

      {/* SEND NOTIFICATION */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Send Notification</h2>

        <div className="grid grid-cols-3 gap-4">

          {/* SEND TO */}
          <div>
            <label className="font-semibold">Send To*</label>
            <select
              className="border p-2 rounded w-full"
              value={data.userId}
              onChange={(e) => setData({ ...data, userId: e.target.value })}
            >
              <option value="">Choose Option</option>
              <option value="ALL_B2B">All B2B Users</option>
              <option value="ALL_B2C">All B2C Users</option>

              <option disabled>────────── Single Users ──────────</option>

              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name || "No Name"} ({u.phone})
                </option>
              ))}
            </select>
          </div>

          {/* TYPE */}
          <div>
            <label className="font-semibold">Type</label>
            <select
              className="border p-2 rounded w-full"
              value={data.type}
              onChange={(e) => setData({ ...data, type: e.target.value })}
            >
              <option value="general">General</option>
              <option value="order">Order</option>
              <option value="stock">Stock</option>
            </select>
          </div>

          {/* MESSAGE */}
          <div className="col-span-3">
            <label className="font-semibold">Message*</label>
            <textarea
              className="border p-2 rounded w-full h-24"
              value={data.message}
              onChange={(e) =>
                setData({ ...data, message: e.target.value })
              }
            ></textarea>
          </div>

        </div>

        <button
          onClick={handleAdd}
          className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
        >
          Send Notification
        </button>
      </div>

      {/* NOTIFICATION TABLE */}
      <div className="bg-white p-6 rounded-xl shadow-md">

        <h2 className="text-xl font-semibold mb-4">All Notifications</h2>

        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Sno</th>
                <th className="p-3 border">User</th>
                <th className="p-3 border">Message</th>
                <th className="p-3 border">Type</th>
                <th className="p-3 border">Read</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {notifications.map((n, index) => (
                <tr key={n._id} className="text-center hover:bg-gray-50">

                  <td className="p-3 border font-semibold">#{index + 1}</td>

                  <td className="p-3 border">
                    {n.userId?.name || "Unknown"}  
                    <br />
                    <span className="text-gray-500">{n.userId?.phone}</span>
                  </td>

                  <td className="p-3 border">{n.message}</td>

                  <td className="p-3 border capitalize">{n.type}</td>

                  <td className="p-3 border">
                    {n.read ? (
                      <span className="text-green-600 font-semibold">Read</span>
                    ) : (
                      <button
                        onClick={() => markRead(n._id)}
                        className="text-blue-600 hover:text-blue-800 flex justify-center mx-auto"
                      >
                        <CheckCircle size={20} />
                      </button>
                    )}
                  </td>

                  <td className="p-3 border">
                    <button
                      onClick={() => handleDelete(n._id)}
                      className="text-red-600 hover:text-red-800 flex justify-center mx-auto"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}
