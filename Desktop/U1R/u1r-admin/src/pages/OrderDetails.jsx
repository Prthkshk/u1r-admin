import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_BASE } from "../config/api";

const emptyOrder = {
  userId: { name: "", phone: "" },
  address: { address: "", city: "", state: "" },
  items: [],
  subtotal: 0,
  deliveryCharge: 0,
  totalAmount: 0,
  status: "PENDING",
};

export default function OrderDetails() {
  const { id } = useParams();

  const [order, setOrder] = useState(emptyOrder);
  const [loading, setLoading] = useState(true);
  const [registration, setRegistration] = useState(null);

  const COMPANY = {
    name: "U1R FOOD PRODUCTS INDIA LLP",
    address: "Sonipat",
    city: "Sonipat",
    state: "Haryana",
    pincode: "131028",
    phone: "7291004400",
    email: "u1rfoods@gmail.com",
    gst: "06AAIFU7724P1ZG",
  };

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(
        `${API_BASE}/api/admin/orders/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const incoming = res.data;
      setOrder(incoming);

      const userId = incoming?.userId?._id;
      if (userId) {
        try {
          const userRes = await axios.get(
            `${API_BASE}/api/admin/users/${userId}/details`,
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setRegistration(userRes.data?.registration || null);
        } catch (regErr) {
          console.log("Registration fetch error:", regErr);
          setRegistration(null);
        }
      } else {
        setRegistration(null);
      }
    } catch (error) {
      console.log("Order fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      const token = localStorage.getItem("adminToken");
      let payload = { status };

      if (status === "DISPATCHED") {
        const defaultDate =
          typeof order?.expectedDelivery === "string" ? order.expectedDelivery : "";
        const selectedDate = window.prompt(
          "Enter expected delivery date (YYYY-MM-DD)",
          defaultDate
        );
        if (selectedDate === null) {
          return;
        }
        if (!selectedDate.trim()) {
          alert("Expected delivery date is required for dispatched orders.");
          return;
        }
        payload.expectedDelivery = selectedDate.trim();
      }

      await axios.put(
        `${API_BASE}/api/admin/orders/status/${id}`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchOrder();
      alert("Status updated!");
    } catch (error) {
      console.log("Status update error:", error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const outlet = registration?.outletDetails || {};
  const owner = registration?.ownerDetails || {};
  const ownerName = [owner.firstName, owner.secondName].filter(Boolean).join(" ").trim();
  const orderDate = order?.createdAt
    ? new Date(order.createdAt).toLocaleString()
    : "-";

  const downloadPdf = () => {
    const itemsRows = (order.items || [])
      .map(
        (i) => `
          <tr>
            <td style="border:1px solid #e5e7eb;padding:8px;">${i.name || "-"}</td>
            <td style="border:1px solid #e5e7eb;padding:8px;text-align:center;">${i.quantity ?? "-"}</td>
            <td style="border:1px solid #e5e7eb;padding:8px;text-align:right;">₹${i.price ?? 0}</td>
            <td style="border:1px solid #e5e7eb;padding:8px;text-align:right;">₹${i.subtotal ?? 0}</td>
          </tr>
        `
      )
      .join("");

    const html = `
      <html>
        <head>
          <title>Order ${order._id}</title>
          <style>
            * { box-sizing: border-box; }
            body { font-family: Arial, sans-serif; color: #111827; padding: 24px; }
            h1, h2, h3 { margin: 0 0 8px 0; }
            .muted { color: #6b7280; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
            .card { border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px; }
            .table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            .table th { background: #f3f4f6; text-align: left; padding: 8px; border: 1px solid #e5e7eb; }
            .table td { padding: 8px; border: 1px solid #e5e7eb; }
            .right { text-align: right; }
            .mt { margin-top: 16px; }
          </style>
        </head>
        <body>
          <div class="grid">
            <div class="card">
              <div class="muted">Company Details</div>
              <div><strong>${COMPANY.name}</strong></div>
              <div>${COMPANY.address}</div>
              <div>${COMPANY.city}, ${COMPANY.state} ${COMPANY.pincode}</div>
              <div>Phone: ${COMPANY.phone}</div>
              <div>Email: ${COMPANY.email}</div>
              <div>GST: ${COMPANY.gst}</div>
            </div>
            <div class="card">
              <div class="muted">Customer Company Details</div>
              <div><strong>${outlet.companyName || order.address?.name || "Unknown"}</strong></div>
              ${outlet.outletName ? `<div>Outlet: ${outlet.outletName}</div>` : ""}
              ${outlet.address ? `<div>${outlet.address}</div>` : ""}
              ${(outlet.city || outlet.state || outlet.pincode)
                ? `<div>${outlet.city || ""}${outlet.city ? "," : ""} ${outlet.state || ""} ${outlet.pincode || ""}</div>`
                : ""}
              <div>GST: ${outlet.gstNumber || "-"}</div>
              <div>Owner: ${ownerName || "-"}</div>
              <div>Phone: ${owner.phone || order.address?.phone || "N/A"}</div>
              <div>Email: ${owner.email || "-"}</div>
              ${Array.isArray(owner.businessType) && owner.businessType.length
                ? `<div>Business Type: ${owner.businessType.join(", ")}</div>`
                : ""}
            </div>
          </div>

          <div class="grid mt">
            <div class="card">
              <div class="muted">Delivery To</div>
              <div><strong>${order.address?.name || "Unknown"}</strong></div>
              <div>${order.address?.address || ""}</div>
              <div>${order.address?.city || ""}, ${order.address?.state || ""} ${order.address?.pincode || ""}</div>
              ${order.address?.landmark ? `<div>Landmark: ${order.address.landmark}</div>` : ""}
              <div>Phone: ${order.address?.phone || "N/A"}</div>
            </div>
            <div class="card">
              <div class="muted">Order Info</div>
              <div>Order ID: ${order._id}</div>
              <div>Date & Time: ${orderDate}</div>
              <div>Status: ${order.status}</div>
            </div>
          </div>

          <div class="mt">
            <table class="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align:center;">Qty</th>
                  <th class="right">Price</th>
                  <th class="right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRows || ""}
              </tbody>
            </table>
          </div>

          <div class="mt" style="display:flex;justify-content:flex-end;">
            <div style="min-width:260px;border:1px solid #e5e7eb;border-radius:8px;padding:12px;">
              <div class="right">Subtotal: ₹${order.subtotal || 0}</div>
              <div class="right">Delivery: ₹${order.deliveryCharge || 0}</div>
              <div class="right" style="font-weight:700;margin-top:6px;">Total: ₹${order.totalAmount || 0}</div>
            </div>
          </div>
        </body>
      </html>
    `;

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  };

  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="w-full bg-red-500 text-white p-6 rounded-b-xl mb-6">
        <h1 className="text-4xl heading-font font-bold">
          ORDER DETAILS
        </h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">

        {/* BILL DETAILS */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Bill Details</h2>
          <button
            type="button"
            onClick={downloadPdf}
            className="px-4 py-2 rounded-lg border bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Download PDF
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Company Details</p>
            <p className="font-semibold mt-1">{COMPANY.name}</p>
            <p className="text-gray-700">{COMPANY.address}</p>
            <p className="text-gray-700">
              {COMPANY.city}, {COMPANY.state} {COMPANY.pincode}
            </p>
            <p className="text-gray-700">Phone: {COMPANY.phone}</p>
            <p className="text-gray-700">Email: {COMPANY.email}</p>
            <p className="text-gray-700">GST: {COMPANY.gst}</p>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Customer Company Details</p>
            <p className="font-semibold mt-1">
              {outlet.companyName || order.address?.name || "Unknown"}
            </p>
            {outlet.outletName ? (
              <p className="text-gray-700">Outlet: {outlet.outletName}</p>
            ) : null}
            {outlet.address ? (
              <p className="text-gray-700">{outlet.address}</p>
            ) : null}
            {(outlet.city || outlet.state || outlet.pincode) ? (
              <p className="text-gray-700">
                {outlet.city || ""}{outlet.city ? "," : ""} {outlet.state || ""}{" "}
                {outlet.pincode || ""}
              </p>
            ) : null}
            <p className="text-gray-700">GST: {outlet.gstNumber || "-"}</p>
            <p className="text-gray-700">Owner: {ownerName || "-"}</p>
            <p className="text-gray-700">
              Phone: {owner.phone || order.address?.phone || "N/A"}
            </p>
            <p className="text-gray-700">Email: {owner.email || "-"}</p>
            {Array.isArray(owner.businessType) && owner.businessType.length ? (
              <p className="text-gray-700">
                Business Type: {owner.businessType.join(", ")}
              </p>
            ) : null}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Delivery To</p>
            <p className="font-semibold mt-1">
              {order.address?.name || "Unknown"}
            </p>
            <p className="text-gray-700">{order.address?.address}</p>
            <p className="text-gray-700">
              {order.address?.city}, {order.address?.state}{" "}
              {order.address?.pincode}
            </p>
            {order.address?.landmark ? (
              <p className="text-gray-700">Landmark: {order.address?.landmark}</p>
            ) : null}
            <p className="text-gray-700">Phone: {order.address?.phone || "N/A"}</p>
          </div>

          <div className="border rounded-lg p-4">
            <p className="text-sm text-gray-500">Order Info</p>
            <p className="text-gray-700">Order ID: {order._id}</p>
            <p className="text-gray-700">Date &amp; Time: {orderDate}</p>
            <p className="text-gray-700">Status: {order.status}</p>
          </div>
        </div>

        <hr className="my-6" />

        {/* USER INFO */}
        <h2 className="text-xl font-semibold mb-4">Customer Information</h2>

        <p>
          <strong>Name:</strong>{" "}
          {order.userId?.name || order.address?.name || "Unknown"}
        </p>
        <p>
          <strong>Phone:</strong>{" "}
          {order.userId?.phone || order.address?.phone || "N/A"}
        </p>
        <p>
          <strong>Address:</strong>{" "}
          {order.address?.address}, {order.address?.city}, {order.address?.state}
        </p>

        <hr className="my-6" />

        {/* ITEMS */}
        <h2 className="text-xl font-semibold mb-4">Items</h2>

        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Product</th>
                <th className="p-3 border">Qty</th>
                <th className="p-3 border">Price</th>
                <th className="p-3 border">Subtotal</th>
              </tr>
            </thead>

            <tbody>
              {order.items.map((i) => (
                <tr key={i._id}>
                  <td className="p-3 border">{i.name}</td>
                  <td className="p-3 border">{i.quantity}</td>
                  <td className="p-3 border">₹{i.price}</td>
                  <td className="p-3 border">₹{i.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <hr className="my-6" />

        {/* AMOUNT SECTION */}
        <h2 className="text-xl font-semibold mb-4">Amount Summary</h2>

        <p><strong>Subtotal:</strong> ₹{order.subtotal}</p>
        <p><strong>Delivery Charge:</strong> ₹{order.deliveryCharge}</p>
        <p className="text-xl font-bold">
          Total: ₹{order.totalAmount}
        </p>

        <hr className="my-6" />

        {/* STATUS UPDATE */}
        <h2 className="text-xl font-semibold mb-4">Update Status</h2>

        <select
          className="border p-2 rounded w-64"
          value={order.status}
          onChange={(e) => updateStatus(e.target.value)}
        >
          <option value="PENDING">PENDING</option>
          <option value="DISPATCHED">DISPATCHED</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

      </div>
    </div>
  );
}
