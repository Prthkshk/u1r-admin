import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_BASE, withBase } from "../config/api";

export default function ViewProducts({ mode }) {
  const navigate = useNavigate();
  const initialMode = mode || "wholesale";
  const [activeMode, setActiveMode] = useState(initialMode);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [search, setSearch] = useState("");
  const [activeWeight, setActiveWeight] = useState("all");
  const formatPrice = (value) => `₹${(Number(value) || 0).toLocaleString("en-IN")}`;
  const resolvedMode = mode || activeMode;
  const isRetail = resolvedMode === "retail";
  const modeQuery = resolvedMode ? `?mode=${resolvedMode}` : "";
  const addProductPath =
    resolvedMode === "wholesale"
      ? "/admin/wholesale/add-product"
      : resolvedMode === "retail"
      ? "/admin/retail/add-product"
      : "/admin/add-product";

  const normalizeId = (value) => (typeof value === "string" ? value : value?._id || "");
  const categoryLookup = new Map(
    categories.map((c) => [normalizeId(c?._id), c?.name || "Uncategorized"])
  );

  const resolveCategoryNames = (product) => {
    const names = [];
    const pushName = (value) => {
      const name = value?.name || categoryLookup.get(normalizeId(value));
      if (name && !names.includes(name)) names.push(name);
    };

    if (Array.isArray(product?.categoryIds) && product.categoryIds.length) {
      product.categoryIds.forEach(pushName);
    } else if (product?.categoryId) {
      pushName(product.categoryId);
    }

    return names.length ? names.join(", ") : "Uncategorized";
  };

  const weightOptions = useMemo(() => {
    if (resolvedMode !== "wholesale") return [];
    const set = new Set();
    products.forEach((p) => {
      const raw = String(p?.weight ?? "").trim();
      if (!raw) return;
      set.add(raw);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [products, resolvedMode]);

  useEffect(() => {
    if (resolvedMode !== "wholesale") return;
    if (activeWeight === "all") return;
    if (!weightOptions.includes(activeWeight)) {
      setActiveWeight("all");
    }
  }, [weightOptions, activeWeight, resolvedMode]);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await axios.get(`${API_BASE}/api/admin/product${modeQuery}`, {
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

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${API_BASE}/api/admin/category${modeQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const incoming = res.data?.data ?? res.data ?? [];
      setCategories(Array.isArray(incoming) ? incoming : []);
    } catch (error) {
      console.log("Error fetching categories:", error);
    }
  };

  const fetchSubcategories = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await axios.get(`${API_BASE}/api/admin/subcategory${modeQuery}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const incoming = res.data?.data ?? res.data ?? [];
      setSubcategories(Array.isArray(incoming) ? incoming : []);
    } catch (error) {
      console.log("Error fetching subcategories:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubcategories();
  }, [modeQuery]);

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

  const downloadProductsPdf = () => {
    if (!products.length) {
      alert("No products to download.");
      return;
    }

    const categoryMap = new Map(
      categories.map((c) => [normalizeId(c?._id), c?.name || "Uncategorized"])
    );

    const subcategoryMap = new Map(
      subcategories.map((s) => [normalizeId(s?._id), s?.name || "Unassigned"])
    );

    const resolveCategoryName = (product) => {
      const names = [];
      const pushName = (value) => {
        const name = value?.name || categoryMap.get(normalizeId(value));
        if (name && !names.includes(name)) names.push(name);
      };

      if (Array.isArray(product?.categoryIds) && product.categoryIds.length) {
        product.categoryIds.forEach(pushName);
      } else if (product?.categoryId) {
        pushName(product.categoryId);
      }

      return names.length ? names.join(", ") : "Uncategorized";
    };

    const resolveSubcategoryName = (product) => {
      if (product?.subcategoryId?.name) return product.subcategoryId.name;
      const directId = normalizeId(product?.subcategoryId);
      if (directId && subcategoryMap.has(directId)) return subcategoryMap.get(directId);

      const firstSub = Array.isArray(product?.subcategoryIds) ? product.subcategoryIds[0] : null;
      if (firstSub?.name) return firstSub.name;
      const firstId = normalizeId(firstSub);
      if (firstId && subcategoryMap.has(firstId)) return subcategoryMap.get(firstId);

      return "Unassigned";
    };

    const prepared = products.map((p) => ({
      category: resolveCategoryName(p),
      subcategory: resolveSubcategoryName(p),
      name: p?.name || "-",
      unit: p?.weight || "-",
      qty: p?.moq || "-",
      rate: Number(p?.price || 0),
    }));

    prepared.sort((a, b) => {
      const byCategory = a.category.localeCompare(b.category);
      if (byCategory !== 0) return byCategory;
      const bySub = a.subcategory.localeCompare(b.subcategory);
      if (bySub !== 0) return bySub;
      return a.name.localeCompare(b.name);
    });

    const grouped = prepared.reduce((acc, item) => {
      const key = item.category || "Uncategorized";
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {});

    const sectionHtml = Object.keys(grouped)
      .sort((a, b) => a.localeCompare(b))
      .map((categoryName) => {
        const rows = grouped[categoryName]
          .map(
            (item, idx) => `
              <tr>
                <td style="padding:2px 6px;text-align:right;width:28px;">${idx + 1}</td>
                <td style="padding:2px 6px;">${item.name}</td>
                <td style="padding:2px 6px;text-align:center;width:70px;">${item.unit}</td>
                <td style="padding:2px 6px;text-align:center;width:50px;">${item.qty}</td>
                <td style="padding:2px 6px;text-align:right;width:70px;">${item.rate ? item.rate.toLocaleString("en-IN") : "-"}</td>
              </tr>
            `
          )
          .join("");

        return `
          <table class="category-table">
            <thead>
              <tr class="category-bar">
                <th colspan="2">${categoryName}</th>
                <th>Unit</th>
                <th>Qty</th>
                <th>Rate</th>
              </tr>
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        `;
      })
      .join("");

    const html = `
      <html>
        <head>
          <title>Products Export</title>
          <style>
            * { box-sizing: border-box; }
            body { font-family: Arial, sans-serif; color: #111827; padding: 24px; }
            h1 { margin: 0 0 8px 0; }
            .muted { color: #6b7280; }
            .category-table { width: 100%; border-collapse: collapse; margin-top: 18px; }
            .category-table tbody td { font-size: 12px; }
            .category-bar th {
              background: #f6b500;
              color: #111;
              font-weight: 700;
              padding: 4px 6px;
              text-align: center;
            }
            .category-bar th:first-child { text-align: center; }
          </style>
        </head>
        <body>
          <h1>Products (Category / Subcategory Wise)</h1>
          <div class="muted">Total Products: ${prepared.length}</div>
          ${sectionHtml}
        </body>
      </html>
    `;

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
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
        {!mode && (
          <div className="flex items-center gap-3 mb-4">
            <span className="text-sm text-gray-600">Mode:</span>
            <button
              type="button"
              onClick={() => setActiveMode("wholesale")}
              className={`px-3 py-1 rounded-full text-sm border ${
                resolvedMode === "wholesale"
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-gray-700"
              }`}
            >
              Wholesale
            </button>
            <button
              type="button"
              onClick={() => setActiveMode("retail")}
              className={`px-3 py-1 rounded-full text-sm border ${
                resolvedMode === "retail"
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-gray-700"
              }`}
            >
              Retail
            </button>
          </div>
        )}

        {/* Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => navigate(addProductPath)}
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              Add Product
            </button>
            <button
              type="button"
              onClick={downloadProductsPdf}
              className="px-4 py-2 rounded-lg border bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Download Category/Subcategory PDF
            </button>
          </div>
          <input
            type="text"
            placeholder="Search..."
            className="border px-3 py-2 rounded-lg focus:ring-2 focus:ring-red-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {resolvedMode === "wholesale" && weightOptions.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-sm text-gray-600">Weight:</span>
            <button
              type="button"
              onClick={() => setActiveWeight("all")}
              className={`px-3 py-1 rounded-full text-sm border ${
                activeWeight === "all"
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white text-gray-700"
              }`}
            >
              All
            </button>
            {weightOptions.map((weight) => (
              <button
                key={weight}
                type="button"
                onClick={() => setActiveWeight(weight)}
                className={`px-3 py-1 rounded-full text-sm border ${
                  activeWeight === weight
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-white text-gray-700"
                }`}
              >
                {weight}
              </button>
            ))}
          </div>
        )}

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
                <th className="p-3 border">{isRetail ? "Sale Price" : "Price"}</th>
                {isRetail && <th className="p-3 border">MRP</th>}
                <th className="p-3 border">Stock</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>

            <tbody>

              {products
                .filter((item) =>
                  item.name?.toLowerCase().includes(search.toLowerCase())
                )
                .filter((item) => {
                  if (resolvedMode !== "wholesale") return true;
                  if (activeWeight === "all") return true;
                  return String(item?.weight ?? "").trim() === activeWeight;
                })
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
                      {resolveCategoryNames(item)}
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
                    {isRetail && (
                      <td className="p-3 border">
                        <span className="text-gray-500 line-through">
                          {formatPrice(item.mrp ?? item.oldPrice ?? item.price)}
                        </span>
                      </td>
                    )}

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
