import { useEffect, useState } from "react";
import axios from "axios";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api";

export default function Orders({ mode }) {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [orderType, setOrderType] = useState(
    mode === "retail" ? "b2c" : "b2b"
  );
  const modeLabel =
    mode === "wholesale" ? "Wholesale" : mode === "retail" ? "Retail" : "";
  const modeQuery = mode ? `?mode=${mode}` : "";

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const typePath = orderType === "b2c" ? "/b2c" : "/b2b";

      const res = await axios.get(`${API_BASE}/api/admin/orders${typePath}${modeQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(res.data);
    } catch (error) {
      console.log("Fetch Orders Error:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [mode, orderType]);

  useEffect(() => {
    if (mode === "retail") {
      setOrderType("b2c");
      return;
    }
    if (mode === "wholesale") {
      setOrderType("b2b");
    }
  }, [mode]);

  const getOrderUser = (order) => {
    const name = order?.userId?.name || order?.address?.name || "Unknown";
    const phone = order?.userId?.phone || order?.address?.phone || "N/A";
    return { name, phone };
  };

  const updateStatus = async (id, status, currentExpectedDelivery) => {
    try {
      const token = localStorage.getItem("adminToken");
      setUpdatingId(id);
      let payload = { status };

      if (status === "DISPATCHED") {
        const defaultDate =
          typeof currentExpectedDelivery === "string" && currentExpectedDelivery.trim()
            ? currentExpectedDelivery.trim()
            : "";
        const selectedDate = window.prompt(
          "Enter expected delivery date (YYYY-MM-DD)",
          defaultDate
        );
        if (selectedDate === null) {
          setUpdatingId("");
          return;
        }
        if (!selectedDate.trim()) {
          alert("Expected delivery date is required for dispatched orders.");
          setUpdatingId("");
          return;
        }
        payload.expectedDelivery = selectedDate.trim();
      }

      await axios.put(
        `${API_BASE}/api/admin/orders/status/${id}${modeQuery}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrders((prev) =>
        prev.map((o) =>
          o._id === id
            ? {
                ...o,
                status,
                ...(payload.expectedDelivery ? { expectedDelivery: payload.expectedDelivery } : {}),
              }
            : o
        )
      );
    } catch (error) {
      console.log("Status update error:", error);
      alert("Unable to update status");
    } finally {
      setUpdatingId("");
    }
  };

  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="w-full bg-red-500 text-white p-6 rounded-b-xl mb-6">
        <h1 className="text-4xl font-bold heading-font">
          {modeLabel ? `${modeLabel.toUpperCase()} ` : ""}ORDERS
        </h1>
      </div>

      {/* SEARCH BAR */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-xl font-semibold">
              All {modeLabel ? `${modeLabel} ` : ""}Orders
            </h2>
            <div className="flex items-center gap-3">
              {mode !== "retail" && (
                <button
                  type="button"
                  onClick={() => setOrderType("b2b")}
                  className={`px-4 py-2 rounded-lg ${
                    orderType === "b2b"
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  B2B Orders
                </button>
              )}
              {mode !== "wholesale" && (
                <button
                  type="button"
                  onClick={() => setOrderType("b2c")}
                  className={`px-4 py-2 rounded-lg ${
                    orderType === "b2c"
                      ? "bg-red-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  B2C Orders
                </button>
              )}
            </div>
          </div>

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
                .filter((o) => {
                  const name =
                    o.userId?.name ||
                    o.address?.name ||
                    "";
                  const phone =
                    o.userId?.phone ||
                    o.address?.phone ||
                    "";
                  return (
                    name.toLowerCase().includes(search.toLowerCase()) ||
                    phone.includes(search)
                  );
                })
                .map((o, index) => {
                  const user = getOrderUser(o);
                  return (
                    <tr key={o._id} className="text-center hover:bg-gray-50">

                    {/* Order Number */}
                    <td className="p-3 border font-semibold">
                      #{index + 1}
                    </td>

                    {/* User */}
                    <td className="p-3 border">
                      {user.name} <br />
                      <span className="text-gray-500">
                        {user.phone}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="p-3 border">
                      ₹{o.totalAmount}
                    </td>

                    {/* STATUS */}
                    <td className="p-3 border">
                      <select
                        className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                          o.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                            : o.status === "DISPATCHED"
                            ? "bg-blue-100 text-blue-700 border-blue-200"
                            : o.status === "DELIVERED"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-red-100 text-red-700 border-red-200"
                        }`}
                        value={o.status}
                        onChange={(e) => updateStatus(o._id, e.target.value, o.expectedDelivery)}
                        disabled={updatingId === o._id}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="DISPATCHED">DISPATCHED</option>
                        <option value="DELIVERED">DELIVERED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
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
                  );
                })}
            </tbody>

          </table>
        </div>

      </div>
    </div>
  );
}
