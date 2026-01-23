import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE, withBase } from "../config/api";

export default function EditSubcategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    categoryId: "",
    image: ""
  });

  const [newImage, setNewImage] = useState(null);

  const [categories, setCategories] = useState([]);

  const fetchData = async () => {
    const token = localStorage.getItem("adminToken");

    // Fetch all categories
    const cat = await axios.get(`${API_BASE}/api/admin/category`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCategories(cat.data);

    // Fetch this subcategory
    const sub = await axios.get(`${API_BASE}/api/admin/subcategory`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const selected = sub.data.find((s) => s._id === id);
    if (selected) {
      setData({
        name: selected.name,
        categoryId: selected.categoryId?._id,
        image: selected.image,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("categoryId", data.categoryId);

      if (newImage) formData.append("image", newImage);

      await axios.put(`${API_BASE}/api/admin/subcategory/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Subcategory updated!");
      navigate("/admin/subcategories");

    } catch (error) {
      console.log("Update error:", error);
    }
  };

  return (
    <div className="w-full">

      <div className="w-full bg-red-500 text-white p-6 rounded-b-xl mb-6">
        <h1 className="text-4xl font-bold heading-font">EDIT SUBCATEGORY</h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">

        <label className="font-semibold">Subcategory Name*</label>
        <input
          className="w-full border p-2 rounded mb-4"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        <label className="font-semibold">Category*</label>
        <select
          className="border p-2 rounded w-full mb-4"
          value={data.categoryId}
          onChange={(e) =>
            setData({ ...data, categoryId: e.target.value })
          }
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {data.image && (
          <div className="mb-4">
            <p className="font-semibold">Current Image:</p>
            <img
              src={withBase(data.image)}
              className="w-24 h-24 rounded object-cover border mt-2"
            />
          </div>
        )}

        <label className="font-semibold">Change Image</label>
        <input
          type="file"
          className="w-full mb-6"
          onChange={(e) => setNewImage(e.target.files[0])}
        />

        <button
          onClick={handleUpdate}
          className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600"
        >
          Update Subcategory
        </button>

      </div>
    </div>
  );
}
