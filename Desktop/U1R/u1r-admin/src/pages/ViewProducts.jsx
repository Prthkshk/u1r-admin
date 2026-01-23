import { useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE, withBase } from "../config/api";

export default function ViewProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const formatPrice = (value) => `₹${(Number(value) || 0).toLocaleString("en-IN")}`;

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(`${API_BASE}/api/admin/product`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const incoming = res.data?.data ?? res.data ?? [];
      setProducts(Array.isArray(incoming) ? incoming : []);
    } catch (error) {
      console.log("Error fetching products:", error);
      alert(error?.response?.data?.message || "Unable to load products");
      if (error?.response?.status === 401) {
        navigate("/admin/login");
      }
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleToggleStock = async (id, currentStock) => {
    const makeAvailable = !(currentStock > 0);
    if (!confirm(`Mark this product as ${makeAvailable ? "Available" : "Out of Order"}?`)) return;

    const token = localStorage.getItem("adminToken");
    const desiredStock = makeAvailable ? 1 : 0;
    const authHeaders = { Authorization: `Bearer ${token}` };

    const showError = (err) => {
      const data = err?.response?.data;
      const msg =
        data?.message ||
        data?.error ||
        err?.message ||
        "Could not update product stock";
      alert(msg);
    };

    try {
      await axios.put(
        `${API_BASE}/api/admin/product/${id}/stock`,
        { stock: desiredStock },
        { headers: authHeaders }
      );
      return fetchProducts();
    } catch (error) {
      console.log("Toggle stock error (primary):", error?.response?.data || error);

      // Fallback for legacy backend: use full product update if /stock route is missing
      if (error?.response?.status === 404 || error?.response?.status === 405) {
        try {
          const formData = new FormData();
          formData.append("stock", String(desiredStock));

          await axios.put(`${API_BASE}/api/admin/product/${id}`, formData, {
            headers: {
              ...authHeaders,
              "Content-Type": "multipart/form-data",
            },
          });
          return fetchProducts();
        } catch (fallbackErr) {
          console.log("Toggle stock error (fallback):", fallbackErr?.response?.data || fallbackErr);
          return showError(fallbackErr);
        }
      }

      return showError(error);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    if (!confirm(`Mark this product as ${currentStatus ? "Inactive" : "Active"}?`)) return;

    const token = localStorage.getItem("adminToken");
    const desiredStatus = !currentStatus;
    const authHeaders = { Authorization: `Bearer ${token}` };

    // Helper to surface a readable message to the admin
    const showError = (err) => {
      const data = err?.response?.data;
      const msg =
        data?.message ||
        data?.error ||
        err?.message ||
        "Could not update product status";
      alert(msg);
    };

    try {
      await axios.put(
        `${API_BASE}/api/admin/product/${id}/status`,
        { status: desiredStatus }, // send boolean
        { headers: authHeaders }
      );
      return fetchProducts();
    } catch (error) {
      console.log("Toggle status error (primary):", error?.response?.data || error);

      // Legacy backend compatibility: fall back to full product update when /status route is missing
      if (error?.response?.status === 404 || error?.response?.status === 405) {
        try {
          const formData = new FormData();
          formData.append("status", String(desiredStatus));

          await axios.put(`${API_BASE}/api/admin/product/${id}`, formData, {
            headers: {
              ...authHeaders,
              "Content-Type": "multipart/form-data",
            },
          });
          return fetchProducts();
        } catch (fallbackErr) {
          console.log("Toggle status error (fallback):", fallbackErr?.response?.data || fallbackErr);
          return showError(fallbackErr);
        }
      }

      return showError(error);
    }
  };

  // Delete Product
  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;

    try {
      const token = localStorage.getItem("adminToken");

      await axios.delete(`${API_BASE}/api/admin/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchProducts();
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  return (
    <div className="w-full">

      {/* Red Header */}
      <div className="w-full bg-red-500 text-white p-6 rounded-b-xl mb-6">
        <h1 className="text-4xl font-bold heading-font">VIEW PRODUCT</h1>
      </div>

      {/* Table Card */}
      <div className="bg-white p-6 shadow-md rounded-xl border">

        <h2 className="text-xl font-semibold mb-4">View Product</h2>

        {/* Search Bar */}
        <div className="flex justify-between mb-4">
          <div></div>
          <input
            type="text"
            placeholder="Search..."
            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-red-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border">Sno</th>
                <th className="p-3 border">Image</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Position</th>
                <th className="p-3 border">Price</th>
                <th className="p-3 border">Stock</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>

            <tbody>

              {products
                .filter((item) =>
                  item.name?.toLowerCase().includes(search.toLowerCase())
                )
                .map((item, index) => (
                  <tr
                    key={item._id}
                    className="text-center hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/admin/edit-product/${item._id}`)}
                  >
                    {/* Sno */}
                    <td className="p-3 border font-semibold">#{index + 1}</td>

                    {/* Image */}
                    <td className="p-3 border">
                      <img
                        src={withBase(item.image)}
                        alt={item.name}
                        className="w-12 h-12 rounded object-cover mx-auto"
                      />
                    </td>

                    {/* Name */}
                    <td className="p-3 border font-semibold">{item.name}</td>

                    {/* Category */}
                    <td className="p-3 border">
                      {item.categoryId?.name || "N/A"}
                    </td>

                    {/* Position */}
                    <td className="p-3 border font-semibold">
                      {item.position ?? "-"}
                    </td>

                    {/* Price */}
                    <td className="p-3 border">
                      <span className="text-green-600 font-bold">
                        {formatPrice(item.price)}
                      </span>
                    </td>

                    {/* Stock */}
                    <td className="p-3 border">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleStock(item._id, item.stock);
                        }}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition ${
                          item.stock > 0
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-red-100 text-red-700 hover:bg-red-200"
                        }`}
                        title="Toggle stock availability"
                        type="button"
                      >
                        {item.stock > 0 ? "Available" : "Out of Order"}
                      </button>
                    </td>

                    <td className="p-3 border">
                      <div className="flex items-center justify-center gap-3">

                        {/* EDIT BUTTON */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/edit-product/${item._id}`);
                          }}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={18} />
                        </button>

                        {/* DELETE BUTTON */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item._id);
                          }}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
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
