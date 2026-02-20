import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Eye } from "lucide-react";
import { API_BASE } from "../config/api";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [mode, setMode] = useState("ALL");
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const getUserModes = (user) => {
    const next = Array.isArray(user?.modes) ? user.modes : [];
    if (next.length) return [...new Set(next)];
    return user?.mode ? [user.mode] : [];
  };

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      let url = `${API_BASE}/api/admin/users`;

      if (mode === "B2B") url = `${API_BASE}/api/admin/users/b2b`;
      if (mode === "B2C") url = `${API_BASE}/api/admin/users/b2c`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data);
    } catch (error) {
      console.log("Fetch users error:", error);
    }
  };

  const fetchDetail = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(
        `${API_BASE}/api/admin/users/${id}/details`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setDetail(res.data);
      setShowDetail(true);
    } catch (error) {
      console.log("Fetch detail error:", error);
      alert("Could not load user details");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [mode]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;

    try {
      const token = localStorage.getItem("adminToken");

      await axios.delete(`${API_BASE}/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchUsers();
    } catch (error) {
      console.log("Delete user error:", error);
    }
  };

  return (
    <div className="w-full">
      
      {/* HEADER */}
      <div className="w-full bg-red-500 text-white p-6 rounded-b-xl mb-6">
        <h1 className="text-4xl heading-font font-bold">USERS</h1>
      </div>

      {/* FILTERS */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <div className="flex justify-between items-center">
          
          <div className="flex gap-4">
            <button
              onClick={() => setMode("ALL")}
              className={`px-4 py-2 rounded-lg ${
                mode === "ALL" ? "bg-red-500 text-white" : "bg-gray-200"
              }`}
            >
              All Users
            </button>

            <button
              onClick={() => setMode("B2B")}
              className={`px-4 py-2 rounded-lg ${
                mode === "B2B" ? "bg-red-500 text-white" : "bg-gray-200"
              }`}
            >
              B2B Users
            </button>

            <button
              onClick={() => setMode("B2C")}
              className={`px-4 py-2 rounded-lg ${
                mode === "B2C" ? "bg-red-500 text-white" : "bg-gray-200"
              }`}
            >
              B2C Users
            </button>
          </div>

          <input
            type="text"
            placeholder="Search by name or phone..."
            className="border px-3 py-2 rounded-lg"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">User List</h2>

        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Sno</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Phone</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Mode</th>
                <th className="p-3 border">Date</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {users
                .filter((u) =>
                  (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
                  (u.phone || "").includes(search)
                )
                .map((u, index) => (
                  <tr key={u._id} className="text-center hover:bg-gray-50">
                    
                    <td className="p-3 border font-semibold">#{index + 1}</td>

                    <td className="p-3 border">{u.name || "—"}</td>

                    <td className="p-3 border">{u.phone}</td>

                    <td className="p-3 border">{u.email || "—"}</td>

                    <td className="p-3 border">
                      {getUserModes(u).join(", ") || "-"}
                    </td>

                    <td className="p-3 border">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-3 border flex justify-center gap-4">
                      
                      <button
                        onClick={() => fetchDetail(u._id)}
                        className="text-blue-600 hover:text-blue-800"
                        title="View Details"
                      >
                        <Eye size={20} />
                      </button>

                      {/* DELETE USER */}
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="text-red-600 hover:text-red-800"
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

      {/* DETAIL MODAL */}
      {showDetail && detail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-11/12 max-w-3xl rounded-lg shadow-lg p-6 max-h-[85vh] overflow-y-auto relative">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-black"
              onClick={() => setShowDetail(false)}
            >
              ✕
            </button>
            <h3 className="text-xl font-semibold mb-4">User Details</h3>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="font-semibold">Name:</span> {detail.user?.name || "-"}</div>
              <div><span className="font-semibold">Phone:</span> {detail.user?.phone || "-"}</div>
              <div><span className="font-semibold">Email:</span> {detail.user?.email || "-"}</div>
              <div><span className="font-semibold">Mode:</span> {getUserModes(detail.user).join(", ") || "-"}</div>
              <div><span className="font-semibold">Created:</span> {detail.user?.createdAt ? new Date(detail.user.createdAt).toLocaleString() : "-"}</div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold text-lg mb-2">Registration (Step 1 &amp; 2)</h4>
              {detail.registration ? (
                <div className="space-y-4 text-sm">
                  <div className="border p-3 rounded">
                    <h5 className="font-semibold mb-2">Owner Details</h5>
                    <p><span className="font-semibold">First Name:</span> {detail.registration.ownerDetails?.firstName || "-"}</p>
                    <p><span className="font-semibold">Second Name:</span> {detail.registration.ownerDetails?.secondName || "-"}</p>
                    <p><span className="font-semibold">Phone:</span> {detail.registration.ownerDetails?.phone || "-"}</p>
                    <p><span className="font-semibold">Email:</span> {detail.registration.ownerDetails?.email || "-"}</p>
                    <p><span className="font-semibold">Business Type:</span> {(detail.registration.ownerDetails?.businessType || []).join(", ") || "-"}</p>
                  </div>

                  <div className="border p-3 rounded">
                    <h5 className="font-semibold mb-2">Outlet Details</h5>
                    <p><span className="font-semibold">Company Name:</span> {detail.registration.outletDetails?.companyName || "-"}</p>
                    <p><span className="font-semibold">Outlet Name:</span> {detail.registration.outletDetails?.outletName || "-"}</p>
                    <p><span className="font-semibold">GST:</span> {detail.registration.outletDetails?.gstNumber || "-"}</p>
                    <p><span className="font-semibold">Address:</span> {detail.registration.outletDetails?.address || "-"}</p>
                    <p><span className="font-semibold">City:</span> {detail.registration.outletDetails?.city || "-"}</p>
                    <p><span className="font-semibold">State:</span> {detail.registration.outletDetails?.state || "-"}</p>
                    <p><span className="font-semibold">Pincode:</span> {detail.registration.outletDetails?.pincode || "-"}</p>
                    <p><span className="font-semibold">Landmark:</span> {detail.registration.outletDetails?.landmark || "-"}</p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">No registration form submitted.</p>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
