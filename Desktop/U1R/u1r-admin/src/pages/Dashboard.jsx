import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../config/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [stats, setStats] = useState({
    b2bUsers: 0,
    b2bEnquiry: 0,
    b2bProducts: 0,
    b2bCategories: 0,
    b2bOrders: 0,
    salesData: [],
  });

  // 🚀 Load REAL B2B data from backend
  useEffect(() => {
    const loadStats = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

        const toArray = (res) => {
          if (Array.isArray(res?.data)) return res.data;
          if (Array.isArray(res?.data?.data)) return res.data.data;
          return [];
        };

        const [
          usersRes,
          enquiryRes,
          productsRes,
          categoriesRes,
          ordersRes
        ] = await Promise.all([
          axios.get(`${API_BASE}/api/admin/users/b2b`, { headers: authHeaders }),
          axios.get(`${API_BASE}/api/admin/request-product`, { headers: authHeaders }),
          axios.get(`${API_BASE}/api/admin/product`, { headers: authHeaders }),
          axios.get(`${API_BASE}/api/admin/category`, { headers: authHeaders }),
          axios.get(`${API_BASE}/api/admin/orders/b2b`, { headers: authHeaders }),
        ]);

        const orders = toArray(ordersRes);

        // Build a simple monthly sales series from order totals
        const salesByMonth = orders.reduce((acc, order) => {
          const created = order?.createdAt ? new Date(order.createdAt) : null;
          if (!created || Number.isNaN(created.getTime())) return acc;
          const monthLabel = created.toLocaleString("default", { month: "short" });
          const total = Number(order?.totalAmount) || 0;
          acc[monthLabel] = (acc[monthLabel] || 0) + total;
          return acc;
        }, {});

        const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const salesData = monthOrder
          .filter((m) => salesByMonth[m])
          .map((m) => ({ name: m, sales: salesByMonth[m] }));

        setStats({
          b2bUsers: toArray(usersRes).length,
          b2bEnquiry: toArray(enquiryRes).length,
          b2bProducts: toArray(productsRes).length,
          b2bCategories: toArray(categoriesRes).length,
          b2bOrders: orders.length,
          salesData,
        });

      } catch (error) {
        console.log("Dashboard Stats Error:", error);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="w-full">

      {/* TITLE */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">UIR - Under One Roof</h1>
        <p className="text-gray-600 mt-1">Dashboard</p>
      </div>

      {/* FIRST ROW */}
      <div className="grid grid-cols-4 gap-5">

        {/* Users */}
        <div className="bg-white rounded-xl p-5 border shadow-sm">
          <h3 className="text-gray-700 font-semibold">Users</h3>
          <div className="flex justify-between mt-2 text-sm">
            <span>B2B Users -</span>
            <span className="px-3 py-1 bg-red-500 text-white rounded">
              {stats.b2bUsers}
            </span>
          </div>

          {/* B2C is 0 for now */}
          <div className="flex justify-between mt-2 text-sm">
            <span>B2C Users -</span>
            <span className="px-3 py-1 bg-red-500 text-white rounded">0</span>
          </div>
        </div>

        {/* Enquiry */}
        <div className="bg-white rounded-xl p-5 border shadow-sm">
          <h3 className="text-gray-700 font-semibold">Enquiry</h3>
          <div className="flex justify-between mt-2 text-sm">
            <span>B2B Enquiry -</span>
            <span className="px-3 py-1 bg-red-500 text-white rounded">
              {stats.b2bEnquiry}
            </span>
          </div>

          <div className="flex justify-between mt-2 text-sm">
            <span>B2C Enquiry -</span>
            <span className="px-3 py-1 bg-red-500 text-white rounded">0</span>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-xl p-5 border shadow-sm">
          <h3 className="text-gray-700 font-semibold">Products</h3>
          <div className="flex justify-between mt-2 text-sm">
            <span>B2B Products -</span>
            <span className="px-3 py-1 bg-red-500 text-white rounded">
              {stats.b2bProducts}
            </span>
          </div>

          <div className="flex justify-between mt-2 text-sm">
            <span>B2C Products -</span>
            <span className="px-3 py-1 bg-red-500 text-white rounded">0</span>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white rounded-xl p-5 border shadow-sm">
          <h3 className="text-gray-700 font-semibold">Categories</h3>
          <div className="flex justify-between mt-2 text-sm">
            <span>B2B Categories -</span>
            <span className="px-3 py-1 bg-red-500 text-white rounded">
              {stats.b2bCategories}
            </span>
          </div>

          <div className="flex justify-between mt-2 text-sm">
            <span>B2C Categories -</span>
            <span className="px-3 py-1 bg-red-500 text-white rounded">0</span>
          </div>
        </div>

      </div>

      {/* ORDER */}
      <div className="bg-white rounded-xl p-5 border shadow-sm mt-5 w-1/4">
        <h3 className="text-gray-700 font-semibold">Order</h3>

        <div className="flex justify-between mt-2 text-sm">
          <span>B2B Order -</span>
          <span className="px-3 py-1 bg-red-500 text-white rounded">
            {stats.b2bOrders}
          </span>
        </div>

        <div className="flex justify-between mt-2 text-sm">
          <span>B2C Order -</span>
          <span className="px-3 py-1 bg-red-500 text-white rounded">0</span>
        </div>
      </div>

      {/* GRAPH + CALENDAR */}
      <div className="grid grid-cols-3 gap-5 mt-10">

        {/* SALES GRAPH */}
        <div className="col-span-2 bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="text-gray-700 font-semibold mb-4">Sales Statistics</h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="sales"
                stroke="#EF4444"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* CALENDAR */}
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="text-gray-700 font-semibold mb-4">Date</h3>
          <p className="text-gray-500">November 2025</p>

          <div className="grid grid-cols-7 text-center mt-4 gap-2 text-gray-700 text-sm">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="font-medium">{d}</div>
            ))}

            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className={`py-2 rounded ${
                  i + 1 === 25 ? "border border-red-500 text-red-600" : ""
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <p className="text-center text-sm text-gray-500 mt-10">
        All Rights Reserved © 2025, Under One Roof.
      </p>
    </div>
  );
}
