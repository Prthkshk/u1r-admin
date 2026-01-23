import { useEffect, useState } from "react";
import axios from "axios";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api";

export default function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(`${API_BASE}/api/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(res.data);
    } catch (error) {
      console.log("Fetch Orders Error:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="w-full bg-red-500 text-white p-6 rounded-b-xl mb-6">
        <h1 className="text-4xl font-bold heading-font">ORDERS</h1>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">

        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">All Orders</h2>

          <input
            type="text"
            placeholder="Search by user or phone..."
            className="border px-3 py-2 rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white p-6 rounded-xl shadow-md">

        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Order No</th>
                <th className="p-3 border">User</th>
                <th className="p-3 border">Amount</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders
                .filter((o) =>
                  (o.userId?.name || "")
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                  (o.userId?.phone || "")
                    .includes(search)
                )
                .map((o, index) => (
                  <tr key={o._id} className="text-center hover:bg-gray-50">

                    {/* Order Number */}
                    <td className="p-3 border font-semibold">
                      #{index + 1}
                    </td>

                    {/* User */}
                    <td className="p-3 border">
                      {o.userId?.name || "User Deleted"} <br />
                      <span className="text-gray-500">
                        {o.userId?.phone || "N/A"}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="p-3 border">
                      ₹{o.totalAmount}
                    </td>

                    {/* STATUS */}
                    <td className="p-3 border">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          o.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : o.status === "DELIVERED"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="p-3 border">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </td>

                    {/* ACTION */}
                    <td className="p-3 border">
                      <button
                        onClick={() => navigate(`/admin/order/${o._id}`)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye size={22} />
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
