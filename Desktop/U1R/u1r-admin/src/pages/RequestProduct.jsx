import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { Trash2, CheckCircle } from "lucide-react";
import { API_BASE } from "../config/api";

export default function RequestProduct() {
  const [requests, setRequests] = useState([]);
  const location = useLocation();

  const modeFilter = location.pathname.includes("/retail/")
    ? "retail"
    : location.pathname.includes("/wholesale/")
    ? "wholesale"
    : "";

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(
        `${API_BASE}/api/admin/request-product`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: modeFilter ? { mode: modeFilter } : undefined,
        }
      );

      setRequests(res.data);
    } catch (error) {
      console.log("Fetch Request Product Error:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const markCompleted = async (id) => {
    try {
      const token = localStorage.getItem("adminToken");

      await axios.put(
        `${API_BASE}/api/admin/request-product/${id}`,
        { status: "COMPLETED" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchRequests();
    } catch (error) {
      console.log("Complete Request Error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this request?")) return;

    try {
      const token = localStorage.getItem("adminToken");

      await axios.delete(
        `${API_BASE}/api/admin/request-product/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      fetchRequests();
    } catch (error) {
      console.log("Delete Request Error:", error);
    }
  };

  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="w-full bg-red-500 text-white p-6 rounded-b-xl mb-6">
        <h1 className="text-4xl font-bold heading-font">
          REQUEST PRODUCT
        </h1>
      </div>

      {/* TABLE */}
      <div className="bg-white p-6 rounded-xl shadow-md">

        <h2 className="text-xl font-semibold mb-4">User Requests</h2>

        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Sno</th>
                <th className="p-3 border">User</th>
                <th className="p-3 border">Phone</th>
                <th className="p-3 border">Product Requested</th>
                <th className="p-3 border">Description</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {requests.map((req, index) => (
                <tr key={req._id} className="text-center hover:bg-gray-50">

                  <td className="p-3 border font-semibold">
                    #{index + 1}
                  </td>

                  {/* USER NAME */}
                  <td className="p-3 border">
                    {req.userId?.name || "Unknown"}
                  </td>

                  {/* PHONE */}
                  <td className="p-3 border">
                    {req.userId?.phone || "N/A"}
                  </td>

                  {/* PRODUCT NAME */}
                  <td className="p-3 border">
                    {req.name}
                  </td>

                  {/* DESCRIPTION */}
                  <td className="p-3 border max-w-[300px]">
                    {req.description || "—"}
                  </td>

                  {/* STATUS */}
                  <td className="p-3 border">
                    {req.status === "COMPLETED" ? (
                      <span className="text-green-600 font-semibold">
                        Completed
                      </span>
                    ) : (
                      <span className="text-yellow-600 font-semibold">
                        Pending
                      </span>
                    )}
                  </td>

                  {/* ACTION BUTTONS */}
                  <td className="p-3 border flex justify-center gap-4">

                    {/* MARK COMPLETED */}
                    {req.status !== "COMPLETED" && (
                      <button
                        onClick={() => markCompleted(req._id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <CheckCircle size={22} />
                      </button>
                    )}

                    {/* DELETE REQUEST */}
                    <button
                      onClick={() => handleDelete(req._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={22} />
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
