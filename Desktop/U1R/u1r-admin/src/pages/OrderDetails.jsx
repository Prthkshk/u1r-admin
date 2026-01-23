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

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(
        `${API_BASE}/api/admin/orders/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrder(res.data);
    } catch (error) {
      console.log("Order fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (status) => {
    try {
      const token = localStorage.getItem("adminToken");

      await axios.put(
        `${API_BASE}/api/admin/orders/${id}`,
        { status },
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

  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="w-full bg-red-500 text-white p-6 rounded-b-xl mb-6">
        <h1 className="text-4xl heading-font font-bold">
          ORDER DETAILS
        </h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">

        {/* USER INFO */}
        <h2 className="text-xl font-semibold mb-4">Customer Information</h2>

        <p><strong>Name:</strong> {order.userId?.name}</p>
        <p><strong>Phone:</strong> {order.userId?.phone}</p>
        <p><strong>Address:</strong> {order.address?.address}, {order.address?.city}, {order.address?.state}</p>

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
          <option value="DELIVERED">DELIVERED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

      </div>
    </div>
  );
}
