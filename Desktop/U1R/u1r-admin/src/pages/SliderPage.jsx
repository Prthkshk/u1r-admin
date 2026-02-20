import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE, withBase } from "../config/api";
import { Pencil, Trash2 } from "lucide-react";

export default function SliderPage({ mode }) {
  const [sliders, setSliders] = useState([]);
  const [editingId, setEditingId] = useState("");

  const [image, setImage] = useState(null);
  const [redirectLink, setRedirectLink] = useState("");
  const [linkType, setLinkType] = useState("category");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState("");
  const [priority, setPriority] = useState(1);
  const [active, setActive] = useState(true);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const initialMode = mode || "wholesale";
  const [isRetail, setIsRetail] = useState(initialMode === "retail");
  const [isWholesale, setIsWholesale] = useState(initialMode === "wholesale");
  const resolvedMode = isRetail ? "retail" : isWholesale ? "wholesale" : initialMode;
  const modeLabel =
    resolvedMode === "wholesale" ? "Wholesale" : resolvedMode === "retail" ? "Retail" : "";
  const modeQuery = resolvedMode ? `?mode=${resolvedMode}` : "";
  const isModeLocked = Boolean(mode);

  const fetchSliders = async () => {
    const token = localStorage.getItem("adminToken");
    const res = await axios.get(`${API_BASE}/api/admin/slider${modeQuery}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSliders(res.data || []);
  };

  const fetchCategories = async () => {
    const token = localStorage.getItem("adminToken");
    const res = await axios.get(`${API_BASE}/api/admin/category?mode=${resolvedMode}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCategories(res.data || []);
  };

  const fetchSubcategories = async () => {
    const token = localStorage.getItem("adminToken");
    const res = await axios.get(`${API_BASE}/api/admin/subcategory?mode=${resolvedMode}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSubcategories(res.data || []);
  };

  useEffect(() => {
    fetchSliders();
  }, [modeQuery]);

  useEffect(() => {
    if (!mode) return;
    setIsRetail(mode === "retail");
    setIsWholesale(mode === "wholesale");
  }, [mode]);

  useEffect(() => {
    fetchCategories();
    fetchSubcategories();
  }, [resolvedMode]);

  const filteredSubcategories = useMemo(() => {
    if (!selectedCategoryId) return [];
    return (subcategories || []).filter(
      (s) => s?.categoryId?._id === selectedCategoryId || s?.categoryId === selectedCategoryId
    );
  }, [subcategories, selectedCategoryId]);

  useEffect(() => {
    if (linkType === "category") {
      setRedirectLink(selectedCategoryId ? `/category/${selectedCategoryId}` : "");
      return;
    }
    if (linkType === "subcategory") {
      setRedirectLink(selectedSubcategoryId ? `/subcategory/${selectedSubcategoryId}` : "");
    }
  }, [linkType, selectedCategoryId, selectedSubcategoryId]);

  useEffect(() => {
    if (linkType !== "subcategory" || !selectedSubcategoryId || selectedCategoryId) return;
    const matched = (subcategories || []).find((s) => s?._id === selectedSubcategoryId);
    const parentCategoryId = matched?.categoryId?._id || matched?.categoryId || "";
    if (parentCategoryId) setSelectedCategoryId(parentCategoryId);
  }, [linkType, selectedSubcategoryId, selectedCategoryId, subcategories]);

  const resetForm = () => {
    setEditingId("");
    setImage(null);
    setRedirectLink("");
    setLinkType("category");
    setSelectedCategoryId("");
    setSelectedSubcategoryId("");
    setPriority(1);
    setActive(true);
    if (!isModeLocked) {
      setIsRetail(initialMode === "retail");
      setIsWholesale(initialMode === "wholesale");
    }
  };

  const validateLinkSelection = () => {
    if (linkType === "category" && !selectedCategoryId) {
      alert("Please select a category for redirect link.");
      return false;
    }
    if (linkType === "subcategory" && !selectedSubcategoryId) {
      alert("Please select a subcategory for redirect link.");
      return false;
    }
    return true;
  };

  const handleAdd = async () => {
    if (!image) {
      alert("Slider image is required");
      return;
    }
    if (!validateLinkSelection()) return;
    if (isRetail === isWholesale) {
      alert("Select exactly one mode (Retail or Wholesale).");
      return;
    }

    const token = localStorage.getItem("adminToken");
    const form = new FormData();

    form.append("image", image);
    form.append("redirectLink", redirectLink);
    form.append("priority", priority);
    form.append("active", active);
    form.append("isRetail", isRetail ? "1" : "0");
    form.append("isWholesale", isWholesale ? "1" : "0");

    await axios.post(`${API_BASE}/api/admin/slider/create`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Slider created!");
    resetForm();
    fetchSliders();
  };

  const handleEdit = (slider) => {
    const existingLink = String(slider?.redirectLink || "").trim();
    const path = existingLink.startsWith("/") ? existingLink.slice(1) : existingLink;
    const [resource, id] = path.split("/");

    setEditingId(slider?._id || "");
    setImage(null);

    if (resource === "category" && id) {
      setLinkType("category");
      setSelectedCategoryId(id);
      setSelectedSubcategoryId("");
      setRedirectLink(`/category/${id}`);
    } else if (resource === "subcategory" && id) {
      setLinkType("subcategory");
      setSelectedSubcategoryId(id);
      const matched = (subcategories || []).find((s) => s?._id === id);
      const parentCategoryId = matched?.categoryId?._id || matched?.categoryId || "";
      setSelectedCategoryId(parentCategoryId);
      setRedirectLink(`/subcategory/${id}`);
    } else {
      setLinkType("custom");
      setSelectedCategoryId("");
      setSelectedSubcategoryId("");
      setRedirectLink(existingLink);
    }

    setPriority(slider?.priority || 1);
    setActive(Boolean(slider?.active));
    setIsRetail(Boolean(slider?.isRetail));
    setIsWholesale(Boolean(slider?.isWholesale));
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    if (!validateLinkSelection()) return;
    if (isRetail === isWholesale) {
      alert("Select exactly one mode (Retail or Wholesale).");
      return;
    }

    const token = localStorage.getItem("adminToken");
    const form = new FormData();

    if (image) form.append("image", image);
    form.append("redirectLink", redirectLink);
    form.append("priority", priority);
    form.append("active", active);
    form.append("isRetail", isRetail ? "1" : "0");
    form.append("isWholesale", isWholesale ? "1" : "0");

    await axios.put(`${API_BASE}/api/admin/slider/${editingId}`, form, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    alert("Slider updated!");
    resetForm();
    fetchSliders();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete slider?")) return;

    const token = localStorage.getItem("adminToken");

    await axios.delete(`${API_BASE}/api/admin/slider/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchSliders();
  };

  return (
    <div className="w-full">
      <div className="w-full bg-red-500 text-white p-6 rounded-b-xl mb-6">
        <h1 className="text-4xl font-bold heading-font">
          CREATE {modeLabel ? `${modeLabel.toUpperCase()} ` : ""}SLIDER
        </h1>
      </div>

      <div className="bg-white p-6 shadow-md rounded-xl mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Slider" : "Add Slider"}
        </h2>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="font-semibold">Redirect Type</label>
            <select
              className="border p-2 rounded w-full"
              value={linkType}
              onChange={(e) => setLinkType(e.target.value)}
            >
              <option value="category">Category</option>
              <option value="subcategory">Subcategory</option>
              <option value="custom">Custom Link</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">Category</label>
            <select
              className="border p-2 rounded w-full"
              value={selectedCategoryId}
              onChange={(e) => {
                setSelectedCategoryId(e.target.value);
                if (linkType === "subcategory") {
                  setSelectedSubcategoryId("");
                }
              }}
              disabled={linkType === "custom"}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-semibold">Subcategory (Optional)</label>
            <select
              className="border p-2 rounded w-full"
              value={selectedSubcategoryId}
              onChange={(e) => setSelectedSubcategoryId(e.target.value)}
              disabled={linkType !== "subcategory" || !selectedCategoryId}
            >
              <option value="">Select Subcategory</option>
              {filteredSubcategories.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-3">
            <label className="font-semibold">Redirect Link</label>
            <input
              className="border p-2 rounded w-full"
              placeholder="/category/<id> or /subcategory/<id>"
              value={redirectLink}
              onChange={(e) => setRedirectLink(e.target.value)}
              readOnly={linkType !== "custom"}
            />
          </div>

          <div>
            <label className="font-semibold">Priority</label>
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold">Active?</label>
            <select
              className="border p-2 rounded w-full"
              value={active}
              onChange={(e) => setActive(e.target.value === "true")}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div className="col-span-3">
            <label className="font-semibold block mb-2">Visibility</label>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="sliderMode"
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
                  name="sliderMode"
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

          <div>
            <label className="font-semibold">
              {editingId ? "Slider Image (Optional)" : "Slider Image*"}
            </label>
            <input
              type="file"
              className="border p-2 rounded w-full"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          {editingId ? (
            <>
              <button
                onClick={handleUpdate}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
              >
                Update Slider
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleAdd}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
            >
              Add Slider
            </button>
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-4">
          All {modeLabel ? `${modeLabel} ` : ""}Sliders
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Sno</th>
                <th className="p-3 border">Image</th>
                <th className="p-3 border">Priority</th>
                <th className="p-3 border">Active</th>
                <th className="p-3 border">Link</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {sliders.map((s, i) => (
                <tr key={s._id} className="text-center hover:bg-gray-50">
                  <td className="p-3 border font-semibold">#{i + 1}</td>

                  <td className="p-3 border">
                    <img
                      src={withBase(s.image)}
                      className="w-20 h-20 object-cover rounded mx-auto"
                    />
                  </td>

                  <td className="p-3 border">{s.priority}</td>

                  <td className="p-3 border">{s.active ? "Active" : "Inactive"}</td>

                  <td className="p-3 border">{s.redirectLink || "-"}</td>

                  <td className="p-3 border">
                    <button
                      onClick={() => handleEdit(s)}
                      className="text-blue-600 hover:text-blue-800 mr-3"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
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
    </div>
  );
}
