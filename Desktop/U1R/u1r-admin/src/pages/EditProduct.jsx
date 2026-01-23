import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { API_BASE } from "../config/api";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState({
    name: "",
    price: "",
    position: "",
    weight: "",
    moq: "",
    stock: "",
    description: "",
    categoryId: "",
    subcategoryId: "",
    subcategoryIds: []
  });

  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const fetchProduct = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${API_BASE}/api/admin/product/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const subcatIds = (res.data.subcategoryIds && res.data.subcategoryIds.length
        ? res.data.subcategoryIds.map((s) => (typeof s === "string" ? s : s._id))
        : res.data.subcategoryId
        ? [typeof res.data.subcategoryId === "string" ? res.data.subcategoryId : res.data.subcategoryId._id]
        : []);

      const catId = res.data.categoryId
        ? (typeof res.data.categoryId === "string" ? res.data.categoryId : res.data.categoryId._id)
        : "";

      setData({
        ...res.data,
        categoryId: catId,
        subcategoryIds: subcatIds,
        subcategoryId: subcatIds[0] || "",
        position: res.data.position ?? "",
      });
    } catch (error) {
      console.log("Error loading product:", error);
    }
  };

  const fetchCategories = async () => {
    const token = localStorage.getItem("adminToken");
    const res = await axios.get(`${API_BASE}/api/admin/category`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCategories(res.data);
  };

  const fetchSubcategories = async () => {
    const token = localStorage.getItem("adminToken");
    const res = await axios.get(`${API_BASE}/api/admin/subcategory`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setSubcategories(res.data);
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "subcategoryIds") {
          formData.append(key, JSON.stringify(data[key] || []));
        } else {
          formData.append(key, data[key]);
        }
      });

      if (image) formData.append("image", image);

      if (images.length > 0) {
        for (let i = 0; i < images.length; i++) {
          formData.append("images", images[i]);
        }
      }

      await axios.put(`${API_BASE}/api/admin/product/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Product updated!");
      navigate("/admin/view-products");

    } catch (error) {
      console.log("Update error:", error);
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchCategories();
    fetchSubcategories();
  }, []);

  return (
    <div className="w-full">

      <div className="w-full bg-red-500 text-white p-6 rounded-b-xl mb-6">
        <h1 className="text-4xl font-bold heading-font">EDIT PRODUCT</h1>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">

        <label className="font-semibold">Product Name*</label>
        <input
          className="w-full border p-2 rounded mb-4"
          value={data.name}
          onChange={(e) => setData({ ...data, name: e.target.value })}
        />

        <div className="grid grid-cols-4 gap-4">
          <div>
            <label>Selling Price*</label>
            <input
              className="w-full border p-2 rounded"
              value={data.price}
              onChange={(e) => setData({ ...data, price: e.target.value })}
            />
          </div>

          <div>
            <label>Position*</label>
            <input
              className="w-full border p-2 rounded"
              value={data.position}
              onChange={(e) => setData({ ...data, position: e.target.value })}
              placeholder="Display order (lower shows first)"
            />
            <p className="text-xs text-gray-500 mt-1">
              Leave blank to keep current position.
            </p>
          </div>

          <div>
            <label>Stock*</label>
            <input
              className="w-full border p-2 rounded"
              value={data.stock}
              onChange={(e) => setData({ ...data, stock: e.target.value })}
            />
          </div>

          <div>
            <label>MOQ*</label>
            <input
              className="w-full border p-2 rounded"
              value={data.moq}
              onChange={(e) => setData({ ...data, moq: e.target.value })}
            />
          </div>
        </div>

        <div className="mt-4">
          <label>Weight</label>
          <input
            className="w-full border p-2 rounded"
            value={data.weight}
            onChange={(e) => setData({ ...data, weight: e.target.value })}
          />
        </div>

        <div className="mt-4">
          <label>Category</label>
          <select
            className="w-full border p-2 rounded"
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
        </div>

        <div className="mt-4">
          <label>Subcategories (select multiple)</label>
          <select
            multiple
            className="w-full border p-2 rounded h-32"
            value={data.subcategoryIds}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
              setData({
                ...data,
                subcategoryIds: selected,
                subcategoryId: selected[0] || "",
              });
            }}
          >
            {subcategories.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Hold Ctrl/Cmd to pick multiple; first selection is used as primary.
          </p>
        </div>

        <div className="mt-4">
          <label>Description</label>
          <textarea
            className="w-full border p-2 rounded h-32"
            value={data.description}
            onChange={(e) =>
              setData({ ...data, description: e.target.value })
            }
          ></textarea>
        </div>

        <div className="mt-4">
          <label>Main Image</label>
          <input
            type="file"
            className="w-full"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="mt-4">
          <label>Multiple Images</label>
          <input
            type="file"
            multiple
            className="w-full"
            onChange={(e) => setImages(e.target.files)}
          />
        </div>

        <button
          onClick={handleUpdate}
          className="mt-6 bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600"
        >
          Update Product
        </button>

      </div>
    </div>
  );
}
