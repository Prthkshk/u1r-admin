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
    mrp: "",
    position: "",
    weight: "",
    moq: "",
    stock: "",
    description: "",
    categoryId: "",
    categoryIds: [],
    subcategoryId: "",
    subcategoryIds: [],
    isRetail: false,
    isWholesale: true,
    isBestSeller: false
  });

  const [image, setImage] = useState(null);
  const [images, setImages] = useState([]);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [filteredSubcategories, setFilteredSubcategories] = useState([]);

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

      const rawCatId = res.data.categoryId
        ? (typeof res.data.categoryId === "string" ? res.data.categoryId : res.data.categoryId._id)
        : "";
      const catIds = (res.data.categoryIds && res.data.categoryIds.length
        ? res.data.categoryIds.map((c) => (typeof c === "string" ? c : c._id))
        : rawCatId
        ? [rawCatId]
        : []);
      const catId = rawCatId || catIds[0] || "";

      const { oldPrice, mrp, ...rest } = res.data || {};
      setData({
        ...rest,
        mrp: mrp ?? oldPrice ?? "",
        categoryId: catId,
        categoryIds: catIds.length ? catIds : catId ? [catId] : [],
        subcategoryIds: subcatIds,
        subcategoryId: subcatIds[0] || "",
        position: res.data.position ?? "",
        isRetail: res.data.isRetail ?? false,
        isWholesale: res.data.isWholesale ?? true,
        isBestSeller: res.data.isBestSeller ?? false,
      });
    } catch (error) {
      console.log("Error loading product:", error);
    }
  };

  const fetchCategories = async (modeValue) => {
    const token = localStorage.getItem("adminToken");
    const res = await axios.get(`${API_BASE}/api/admin/category?mode=${modeValue}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCategories(res.data);
  };

  const fetchSubcategories = async (modeValue, categoryId) => {
    const token = localStorage.getItem("adminToken");
    const categoryQuery = categoryId ? `&categoryId=${categoryId}` : "";
    const res = await axios.get(
      `${API_BASE}/api/admin/subcategory?mode=${modeValue}${categoryQuery}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setSubcategories(res.data);
  };

  const handleUpdate = async () => {
    try {
      if (data.isRetail === data.isWholesale) {
        alert("Select exactly one mode (Retail or Wholesale).");
        return;
      }

      const token = localStorage.getItem("adminToken");
      const formData = new FormData();

      Object.keys(data).forEach((key) => {
        if (key === "subcategoryIds" || key === "categoryIds") {
          formData.append(key, JSON.stringify(data[key] || []));
          return;
        }
        if (key === "oldPrice" || key === "mrp") {
          return;
        }
        formData.append(key, data[key]);
      });

      if (data.mrp !== undefined && data.mrp !== null && data.mrp !== "") {
        formData.append("oldPrice", data.mrp);
      }

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
  }, []);

  const resolvedMode =
    data.isRetail ? "retail" : data.isWholesale ? "wholesale" : "wholesale";

  useEffect(() => {
    fetchCategories(resolvedMode);
    fetchSubcategories(resolvedMode, resolvedMode === "wholesale" ? "" : data.categoryId);
  }, [resolvedMode]);

  useEffect(() => {
    if (resolvedMode === "wholesale") {
      setFilteredSubcategories(subcategories);
      return;
    }
    if (!data.categoryId) {
      setFilteredSubcategories([]);
      return;
    }
    const next = subcategories.filter(
      (s) => s?.categoryId?._id === data.categoryId || s?.categoryId === data.categoryId
    );
    setFilteredSubcategories(next);
    if (next.length === 0) {
      setData((prev) => ({ ...prev, subcategoryIds: [], subcategoryId: "" }));
    }
  }, [subcategories, data.categoryId, resolvedMode]);

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

        {data.isRetail ? (
          <div className="mt-2">
            <label className="font-semibold block mb-2">Retail Pricing</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label>Sale Price*</label>
                  <input
                    className="w-full border p-2 rounded"
                    value={data.price}
                    onChange={(e) => setData({ ...data, price: e.target.value })}
                  />
                </div>
                <div>
                  <label>MRP*</label>
                  <input
                    className="w-full border p-2 rounded"
                    value={data.mrp}
                    onChange={(e) => setData({ ...data, mrp: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-6 rounded-lg border bg-gray-50 px-5 py-6">
                <div className="text-4xl font-semibold text-black">
                  ₹{data.price || "230"}
                </div>
                <div className="text-4xl font-semibold text-gray-400 line-through">
                  ₹{data.mrp || "350"}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
        )}

        {data.isRetail && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
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
        )}

        <div className="mt-4">
          <label>Weight</label>
          <input
            className="w-full border p-2 rounded"
            value={data.weight}
            onChange={(e) => setData({ ...data, weight: e.target.value })}
          />
        </div>

        <div className="mt-4">
          <label className="font-semibold block mb-2">Visibility</label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="productMode"
                checked={Boolean(data.isRetail)}
                onChange={() =>
                  setData({
                    ...data,
                    isRetail: true,
                    isWholesale: false,
                    isBestSeller: data.isBestSeller,
                  })
                }
              />
              Retail
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="productMode"
                checked={Boolean(data.isWholesale)}
                onChange={() =>
                  setData({
                    ...data,
                    isRetail: false,
                    isWholesale: true,
                    isBestSeller: false,
                  })
                }
              />
              Wholesale
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(data.isBestSeller)}
                onChange={(e) =>
                  setData({ ...data, isBestSeller: e.target.checked })
                }
                disabled={!data.isRetail}
              />
              Bestseller (Retail only)
            </label>
          </div>
        </div>

        <div className="mt-4">
          <label>Categories (select multiple)</label>
          <select
            multiple
            className="w-full border p-2 rounded h-32"
            value={data.categoryIds}
            onChange={(e) => {
              const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
              const nextPrimary = selected[0] || "";
              setData({
                ...data,
                categoryIds: selected,
                categoryId: nextPrimary,
                subcategoryIds: [],
                subcategoryId: "",
              });
              if (resolvedMode === "wholesale") {
                fetchSubcategories(resolvedMode, "");
                return;
              }
              if (nextPrimary) {
                fetchSubcategories(resolvedMode, nextPrimary);
              } else {
                setSubcategories([]);
                setFilteredSubcategories([]);
              }
            }}
          >
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Hold Ctrl/Cmd to pick multiple; first selection is used as primary.
          </p>
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
            {filteredSubcategories.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>
          {resolvedMode !== "wholesale" && data.categoryId && filteredSubcategories.length === 0 && (
            <p className="text-xs text-gray-500 mt-1">No subcategories.</p>
          )}
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
