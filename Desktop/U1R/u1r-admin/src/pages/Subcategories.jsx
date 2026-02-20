import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE, withBase } from "../config/api";

export default function Subcategories({ mode }) {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [image, setImage] = useState(null);
  const initialMode = mode || "wholesale";
  const [isRetail, setIsRetail] = useState(initialMode === "retail");
  const [isWholesale, setIsWholesale] = useState(initialMode === "wholesale");

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const resolvedMode = isRetail ? "retail" : isWholesale ? "wholesale" : initialMode;
  const modeQuery = resolvedMode ? `?mode=${resolvedMode}` : "";
  const isModeLocked = Boolean(mode);

  // Fetch categories & subcategories
  const fetchData = async () => {
    const token = localStorage.getItem("adminToken");

    const cat = await axios.get(`${API_BASE}/api/admin/category${modeQuery}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const sub = await axios.get(`${API_BASE}/api/admin/subcategory${modeQuery}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setCategories(cat.data);
    setSubcategories(sub.data);
  };

  useEffect(() => {
    fetchData();
  }, [modeQuery]);

  useEffect(() => {
    if (!mode) return;
    setIsRetail(mode === "retail");
    setIsWholesale(mode === "wholesale");
  }, [mode]);

  const handleAdd = async () => {
    if (!name || !categoryId) {
      alert("All fields required");
      return;
    }
    if (isRetail === isWholesale) {
      alert("Select exactly one mode (Retail or Wholesale).");
      return;
    }

    const token = localStorage.getItem("adminToken");
    const formData = new FormData();

    formData.append("name", name);
    formData.append("categoryId", categoryId);
    formData.append("isRetail", isRetail ? "1" : "0");
    formData.append("isWholesale", isWholesale ? "1" : "0");
    if (image) formData.append("image", image);

    await axios.post(`${API_BASE}/api/admin/subcategory`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data"
      }
    });

    setName("");
    setCategoryId("");
    setImage(null);
    setIsRetail(resolvedMode === "retail");
    setIsWholesale(resolvedMode === "wholesale");
    fetchData();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this subcategory?")) return;

    const token = localStorage.getItem("adminToken");

    await axios.delete(`${API_BASE}/api/admin/subcategory/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchData();
  };

  return (
    <div className="w-full">

      {/* Header */}
      <div className="w-full bg-red-500 text-white p-6 rounded-b-xl mb-6">
        <h1 className="text-4xl font-bold heading-font">CREATE SUBCATEGORY</h1>
      </div>

      {/* ADD SUBCATEGORY */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">

        <h2 className="text-xl font-semibold mb-4">Add Subcategory</h2>

        <div className="grid grid-cols-3 gap-4">

          <div>
            <label className="font-semibold">Subcategory Name*</label>
            <input
              type="text"
              className="border p-2 rounded w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold">Select Category*</label>
            <select
              className="border p-2 rounded w-full"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">Select Category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold">Subcategory Image</label>
            <input
              type="file"
              className="border p-2 rounded w-full"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

        </div>

        <div className="mt-4">
          <label className="font-semibold block mb-2">Visibility</label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="subcategoryMode"
                checked={isRetail}
                onChange={() => {
                  setIsRetail(true);
                  setIsWholesale(false);
                }}
                disabled={isModeLocked}
              />
              Retail
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="subcategoryMode"
                checked={isWholesale}
                onChange={() => {
                  setIsRetail(false);
                  setIsWholesale(true);
                }}
                disabled={isModeLocked}
              />
              Wholesale
            </label>
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
        >
          Add Subcategory
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white p-6 rounded-xl shadow-md">

        <h2 className="text-xl font-semibold mb-4">All Subcategories</h2>

        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border">Sno</th>
                <th className="p-3 border">Image</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {subcategories.map((s, index) => (
                <tr key={s._id} className="text-center hover:bg-gray-50">

                  <td className="p-3 border font-semibold">#{index + 1}</td>

                  <td className="p-3 border">
                    {s.image ? (
                      <img
                        src={withBase(s.image)}
                        className="w-12 h-12 rounded object-cover mx-auto border"
                      />
                    ) : "—"}
                  </td>

                  <td className="p-3 border">{s.name}</td>

                  <td className="p-3 border">
                    {s.categoryId ? s.categoryId.name : "N/A"}
                  </td>

                  <td className="p-3 border flex justify-center gap-4">

                    <button
                      onClick={() =>
                        navigate(`/admin/edit-subcategory/${s._id}`)
                      }
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(s._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={18} />
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
