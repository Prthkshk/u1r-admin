import { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE, withBase } from "../config/api";

export default function Categories({ mode }) {
  console.log("RETAIL CATEGORY SCREEN LOADED");
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [hasSubcategory, setHasSubcategory] = useState("false");
  const [image, setImage] = useState(null);
  const initialMode = mode || "wholesale";
  const [isRetail, setIsRetail] = useState(initialMode === "retail");
  const [isWholesale, setIsWholesale] = useState(initialMode === "wholesale");

  const [categories, setCategories] = useState([]);
  const resolvedMode = isRetail ? "retail" : isWholesale ? "wholesale" : initialMode;
  const modeLabel =
    resolvedMode === "wholesale" ? "Wholesale" : resolvedMode === "retail" ? "Retail" : "";
  const modeQuery = resolvedMode ? `?mode=${resolvedMode}` : "";
  const isModeLocked = Boolean(mode);

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      console.log("Resolved category mode:", resolvedMode);
      console.log("Calling category API...");
      const res = await axios.get(`${API_BASE}/api/admin/category${modeQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Category API full response:", res);
      console.log("Category API res.data:", res.data);
      console.log("Category API res.data is array:", Array.isArray(res.data));

      if (resolvedMode === "retail") {
        const first = Array.isArray(res.data) ? res.data[0] : res.data;
        console.log("Retail categories response:", res);
        console.log(
          "Retail categories fields:",
          first && typeof first === "object" ? Object.keys(first) : []
        );
      }

      setCategories(res.data);
    } catch (error) {
      console.log("Fetch categories error:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [modeQuery]);

  useEffect(() => {
    if (!mode) return;
    setIsRetail(mode === "retail");
    setIsWholesale(mode === "wholesale");
  }, [mode]);

  // CREATE CATEGORY
  const handleAdd = async () => {
    if (!name.trim()) {
      alert("Category name is required");
      return;
    }
    if (isRetail === isWholesale) {
      alert("Select exactly one mode (Retail or Wholesale).");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();

      formData.append("name", name);
      // Always send a real boolean so the API stores the correct value
      formData.append("hasSubcategory", hasSubcategory === "true" ? "1" : "0");
      formData.append("isRetail", isRetail ? "1" : "0");
      formData.append("isWholesale", isWholesale ? "1" : "0");

      if (image) {
        formData.append("image", image);
      }

      await axios.post(`${API_BASE}/api/admin/category${modeQuery}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setName("");
      setHasSubcategory("false");
      setImage(null);
      setIsRetail(resolvedMode === "retail");
      setIsWholesale(resolvedMode === "wholesale");

      fetchCategories();

    } catch (error) {
      console.log("Add category error:", error);
    }
  };

  // DELETE CATEGORY
  const handleDelete = async (id) => {
    if (!confirm("Delete this category?")) return;

    try {
      const token = localStorage.getItem("adminToken");

      await axios.delete(`${API_BASE}/api/admin/category/${id}${modeQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchCategories();
    } catch (error) {
      console.log("Delete error:", error);
    }
  };

  return (
    <div className="w-full">

      {/* Red Header */}
      <div className="w-full bg-red-500 text-white p-6 rounded-b-xl mb-6">
        <h1 className="text-4xl font-bold heading-font">
          CREATE {modeLabel ? `${modeLabel.toUpperCase()} ` : ""}CATEGORY
        </h1>
      </div>

      {/* ADD CATEGORY CARD */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Add Category</h2>

        <div className="grid grid-cols-3 gap-4">

          {/* Category Name */}
          <div className="col-span-1">
            <label className="font-semibold">Category Name*</label>
            <input
              type="text"
              placeholder="Enter category name"
              className="border p-2 rounded-lg w-full focus:ring-2 focus:ring-red-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Has Subcategory? */}
          <div className="col-span-1">
            <label className="font-semibold">Has Subcategory?</label>
            <select
              className="border p-2 rounded-lg w-full"
              value={hasSubcategory}
              onChange={(e) => setHasSubcategory(e.target.value)}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          {/* Image Upload */}
          <div className="col-span-1">
            <label className="font-semibold">Category Image</label>
            <input
              type="file"
              className="border p-2 rounded-lg w-full"
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
                name="categoryMode"
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
                name="categoryMode"
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

        {/* ADD BUTTON */}
        <button
          onClick={handleAdd}
          className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
        >
          Add Category
        </button>
      </div>

      {/* CATEGORY TABLE */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          All {modeLabel ? `${modeLabel} ` : ""}Categories
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border">Sno</th>
                <th className="p-3 border">Image</th>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Has Subcategory</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((cat, index) => (
                <tr key={cat._id} className="text-center hover:bg-gray-50">

                  <td className="p-3 border font-semibold">#{index + 1}</td>

                  {/* CATEGORY IMAGE */}
                  <td className="p-3 border">
                    {cat.image ? (
                      <img
                        src={withBase(cat.image)}
                        className="w-12 h-12 object-cover rounded mx-auto border"
                        alt={cat.name}
                      />
                    ) : (
                      "N/A"
                    )}
                  </td>

                  {/* NAME */}
                  <td className="p-3 border">{cat.name}</td>

                  {/* HAS SUBCATEGORY */}
                  <td className="p-3 border">
                    {cat.hasSubcategory ? (
                      <span className="text-green-600 font-semibold">Yes</span>
                    ) : (
                      <span className="text-red-600 font-semibold">No</span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3 border flex justify-center gap-4">

                    {/* EDIT BUTTON */}
                    <button
                      onClick={() =>
                        navigate(`/admin/edit-category/${cat._id}`)
                      }
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Pencil size={18} />
                    </button>

                    {/* DELETE BUTTON */}
                    <button
                      onClick={() => handleDelete(cat._id)}
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

