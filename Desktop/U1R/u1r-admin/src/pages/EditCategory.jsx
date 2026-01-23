import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE, withBase } from "../config/api";

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [hasSubcategory, setHasSubcategory] = useState("false");
  const [currentImage, setCurrentImage] = useState("");
  const [image, setImage] = useState(null);

  // Fetch Category Details
  const fetchCategory = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(`${API_BASE}/api/admin/category`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const category = res.data.find((c) => c._id === id);

      if (category) {
        setName(category.name || "");
        setHasSubcategory(category.hasSubcategory ? "true" : "false");
        setCurrentImage(category.image || "");
      }

    } catch (error) {
      console.log("Fetch Category Error:", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  // Update Category
  const handleUpdate = async () => {
    if (!name.trim()) {
      alert("Category name is required");
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("hasSubcategory", hasSubcategory === "true");

      if (image) {
        formData.append("image", image);
      }

      await axios.put(`${API_BASE}/api/admin/category/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Category updated!");
      navigate("/admin/categories");

    } catch (error) {
      console.log("Update Category Error:", error);
    }
  };

  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="w-full bg-red-500 text-white p-6 rounded-b-xl mb-6">
        <h1 className="text-4xl font-bold heading-font">EDIT CATEGORY</h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">

        {/* CATEGORY NAME */}
        <label className="font-semibold">Category Name*</label>
        <input
          className="w-full border p-2 rounded mb-4"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* HAS SUBCATEGORY */}
        <div className="mt-3">
          <label className="font-semibold block mb-2">Has Subcategory?</label>

          <select
            className="border p-2 rounded w-full"
            value={hasSubcategory}
            onChange={(e) => setHasSubcategory(e.target.value)}
          >
            <option value="false">No</option>
            <option value="true">Yes</option>
          </select>
        </div>

        {/* SHOW OLD IMAGE */}
        {currentImage && (
          <div className="mt-4">
            <p className="font-semibold">Current Image:</p>
            <img
              src={withBase(currentImage)}
              alt="Category"
              className="w-24 h-24 object-cover rounded mt-2 border"
            />
          </div>
        )}

        {/* UPDATE IMAGE */}
        <div className="mt-4">
          <label className="font-semibold">Change Category Image</label>
          <input
            type="file"
            className="w-full"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {/* UPDATE BUTTON */}
        <button
          onClick={handleUpdate}
          className="mt-6 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600"
        >
          Update Category
        </button>
      </div>
    </div>
  );
}
