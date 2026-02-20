import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../config/api";

export default function Dashboard() {
  const today = new Date();
  const monthLabel = today.toLocaleString("default", { month: "long", year: "numeric" });
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const startWeekday = firstDayOfMonth.getDay(); // 0 = Sun
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const toDateKey = (dateValue) => {
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return "";
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const todayKey = toDateKey(today);

  const calendarCells = [
    ...Array.from({ length: startWeekday }, (_, i) => ({ key: `blank-${i}`, value: null })),
    ...Array.from({ length: daysInMonth }, (_, i) => ({ key: `day-${i + 1}`, value: i + 1 })),
  ];

  const [stats, setStats] = useState({
    b2bUsers: 0,
    b2cUsers: 0,
    b2bEnquiry: 0,
    b2cEnquiry: 0,
    b2bProducts: 0,
    b2cProducts: 0,
    b2bCategories: 0,
    b2cCategories: 0,
    b2bOrders: 0,
    b2cOrders: 0,
    b2bOrdersByDate: {},
    b2cOrdersByDate: {},
  });
  const [selectedDateKey, setSelectedDateKey] = useState(todayKey);

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
          b2bUsersRes,
          b2cUsersRes,
          b2bEnquiryRes,
          b2cEnquiryRes,
          b2bProductsRes,
          b2cProductsRes,
          b2bCategoriesRes,
          b2cCategoriesRes,
          b2bOrdersRes,
          b2cOrdersRes,
        ] = await Promise.all([
          axios.get(`${API_BASE}/api/admin/users/b2b`, { headers: authHeaders }),
          axios.get(`${API_BASE}/api/admin/users/b2c`, { headers: authHeaders }),
          axios.get(`${API_BASE}/api/admin/request-product`, {
            headers: authHeaders,
            params: { mode: "wholesale" },
          }),
          axios.get(`${API_BASE}/api/admin/request-product`, {
            headers: authHeaders,
            params: { mode: "retail" },
          }),
          axios.get(`${API_BASE}/api/admin/product?mode=wholesale`, { headers: authHeaders }),
          axios.get(`${API_BASE}/api/admin/product?mode=retail`, { headers: authHeaders }),
          axios.get(`${API_BASE}/api/admin/category?mode=wholesale`, { headers: authHeaders }),
          axios.get(`${API_BASE}/api/admin/category?mode=retail`, { headers: authHeaders }),
          axios.get(`${API_BASE}/api/admin/orders/b2b`, { headers: authHeaders }),
          axios.get(`${API_BASE}/api/admin/orders/b2c`, { headers: authHeaders }),
        ]);

        const b2bOrders = toArray(b2bOrdersRes);
        const b2cOrders = toArray(b2cOrdersRes);

        const countByDate = (orders) =>
          orders.reduce((acc, order) => {
            const key = toDateKey(order?.createdAt);
            if (!key) return acc;
            acc[key] = (acc[key] || 0) + 1;
            return acc;
          }, {});

        const b2bOrdersByDate = countByDate(b2bOrders);
        const b2cOrdersByDate = countByDate(b2cOrders);

        setStats({
          b2bUsers: toArray(b2bUsersRes).length,
          b2cUsers: toArray(b2cUsersRes).length,
          b2bEnquiry: toArray(b2bEnquiryRes).length,
          b2cEnquiry: toArray(b2cEnquiryRes).length,
          b2bProducts: toArray(b2bProductsRes).length,
          b2cProducts: toArray(b2cProductsRes).length,
          b2bCategories: toArray(b2bCategoriesRes).length,
          b2cCategories: toArray(b2cCategoriesRes).length,
          b2bOrders: b2bOrders.length,
          b2cOrders: b2cOrders.length,
          b2bOrdersByDate,
          b2cOrdersByDate,
        });

      } catch (error) {
        console.log("Dashboard Stats Error:", error);
      }
    };

    loadStats();
  }, []);

  const selectedDateObj = new Date(selectedDateKey);
  const selectedDateLabel = Number.isNaN(selectedDateObj.getTime())
    ? selectedDateKey
    : selectedDateObj.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
  const selectedB2BCount = stats.b2bOrdersByDate[selectedDateKey] || 0;
  const selectedB2CCount = stats.b2cOrdersByDate[selectedDateKey] || 0;

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
            <span className="px-3 py-1 bg-red-500 text-white rounded">
              {stats.b2cUsers}
            </span>
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
            <span className="px-3 py-1 bg-red-500 text-white rounded">
              {stats.b2cEnquiry}
            </span>
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
            <span className="px-3 py-1 bg-red-500 text-white rounded">
              {stats.b2cProducts}
            </span>
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
            <span className="px-3 py-1 bg-red-500 text-white rounded">
              {stats.b2cCategories}
            </span>
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
          <span className="px-3 py-1 bg-red-500 text-white rounded">
            {stats.b2cOrders}
          </span>
        </div>
      </div>

      {/* GRAPH + CALENDAR */}
      <div className="grid grid-cols-3 gap-5 mt-10">

        {/* DATE-WISE ORDER COUNTS */}
        <div className="col-span-2 bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="text-gray-700 font-semibold mb-2">Orders By Selected Date</h3>
          <p className="text-gray-500 mb-6">{selectedDateLabel}</p>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-red-100 bg-red-50 p-5">
              <p className="text-sm text-gray-600 mb-2">B2B Orders</p>
              <p className="text-3xl font-bold text-red-600">{selectedB2BCount}</p>
            </div>
            <div className="rounded-lg border border-red-100 bg-red-50 p-5">
              <p className="text-sm text-gray-600 mb-2">B2C Orders</p>
              <p className="text-3xl font-bold text-red-600">{selectedB2CCount}</p>
            </div>
          </div>
        </div>

        {/* CALENDAR */}
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="text-gray-700 font-semibold mb-4">Date</h3>
          <p className="text-gray-500">{monthLabel}</p>

          <div className="grid grid-cols-7 text-center mt-4 gap-2 text-gray-700 text-sm">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="font-medium">{d}</div>
            ))}

            {calendarCells.map((cell) => (
              <button
                key={cell.key}
                type="button"
                disabled={!cell.value}
                onClick={() => {
                  if (!cell.value) return;
                  const clickedDate = new Date(
                    today.getFullYear(),
                    today.getMonth(),
                    cell.value
                  );
                  setSelectedDateKey(toDateKey(clickedDate));
                }}
                className={`py-2 rounded ${
                  !cell.value
                    ? "cursor-default"
                    : "hover:bg-red-50"
                } ${
                  cell.value &&
                  selectedDateKey ===
                    toDateKey(new Date(today.getFullYear(), today.getMonth(), cell.value))
                    ? "border border-red-500 text-red-600"
                    : ""
                }`}
              >
                {cell.value || ""}
              </button>
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
