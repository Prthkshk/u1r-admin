import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import axios from "axios";
import { GripVertical } from "lucide-react";
import { API_BASE, withBase } from "../config/api";

const toPosition = (value) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
};

const sortByPosition = (items = []) =>
  [...items].sort((a, b) => {
    const pa = toPosition(a?.position);
    const pb = toPosition(b?.position);
    if (pa !== null && pb !== null) return pa - pb;
    if (pa !== null) return -1;
    if (pb !== null) return 1;
    return 0;
  });

export default function Positions() {
  const [categories, setCategories] = useState([]);
  const [activeMode, setActiveMode] = useState("wholesale");
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [positionType, setPositionType] = useState("products");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const resolvedMode = activeMode || "wholesale";
  const modeQuery = resolvedMode ? `?mode=${resolvedMode}` : "";

  const normalizeId = (val) => (typeof val === "object" && val?._id ? val._id : val);
  const adminHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}` });

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { pressDelay: 150, pressTolerance: 5 })
  );

  const fetchMeta = async () => {
    try {
      const [catRes, subRes] = await Promise.all([
        axios.get(`${API_BASE}/api/admin/category${modeQuery}`, { headers: adminHeaders() }),
        axios.get(`${API_BASE}/api/admin/subcategory${modeQuery}`, { headers: adminHeaders() }),
      ]);
      setCategories(catRes.data || []);
      setSubcategories(sortByPosition(Array.isArray(subRes.data) ? subRes.data : []));
    } catch (error) {
      console.log("Positions meta fetch error:", error?.response?.data || error);
      alert(error?.response?.data?.message || "Unable to load categories");
    }
  };

  const fetchCategoryProducts = async (categoryId) => {
    if (!categoryId) return;
    try {
      setLoading(true);
      const adminRes = await axios.get(`${API_BASE}/api/admin/product${modeQuery}`, {
        headers: adminHeaders(),
      });
      const all = adminRes.data?.data ?? adminRes.data ?? [];
      const filtered = (Array.isArray(all) ? all : []).filter(
        (p) =>
          normalizeId(p.categoryId) === categoryId ||
          normalizeId(p.categoryId?._id) === categoryId
      );
      const sorted = [...filtered].sort((a, b) => {
        const pa = Number(a?.position);
        const pb = Number(b?.position);
        const aOk = Number.isFinite(pa);
        const bOk = Number.isFinite(pb);
        if (aOk && bOk) return pa - pb;
        if (aOk) return -1;
        if (bOk) return 1;
        return 0;
      });
      setProducts(sorted);
    } catch (error) {
      console.log("Positions products fetch error:", error?.response?.data || error);
      alert(error?.response?.data?.message || "Unable to load products for category");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStock = async (id, currentStock) => {
    if (!confirm(`Mark this product as ${currentStock > 0 ? "Out of Stock" : "Available"}?`)) return;

    const desiredStock = currentStock > 0 ? 0 : 1;
    const authHeaders = adminHeaders();

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
      if (selectedCategory) {
        await fetchCategoryProducts(selectedCategory);
      }
    } catch (error) {
      console.log("Toggle stock error (primary):", error?.response?.data || error);

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
          if (selectedCategory) {
            await fetchCategoryProducts(selectedCategory);
          }
          return;
        } catch (fallbackErr) {
          console.log("Toggle stock error (fallback):", fallbackErr?.response?.data || fallbackErr);
          return showError(fallbackErr);
        }
      }

      return showError(error);
    }
  };

  useEffect(() => {
    fetchMeta();
  }, [modeQuery]);

  useEffect(() => {
    if (positionType === "products" && selectedCategory) {
      fetchCategoryProducts(selectedCategory);
    } else if (!selectedCategory) {
      setProducts([]);
    }
  }, [selectedCategory, modeQuery, positionType]);

  const selectedCategoryObj = useMemo(
    () => categories.find((c) => normalizeId(c._id) === selectedCategory),
    [categories, selectedCategory]
  );

  const categorySubcategories = useMemo(() => {
    if (!selectedCategory) return [];
    return sortByPosition(
      subcategories.filter((s) => normalizeId(s.categoryId) === selectedCategory)
    );
  }, [selectedCategory, subcategories]);

  const subcategoryLookup = useMemo(() => {
    const map = new Map();
    subcategories.forEach((s) => {
      map.set(normalizeId(s._id), s);
    });
    return map;
  }, [subcategories]);

  const groupedBySubcategory = useMemo(() => {
    const groups = {};
    const order = [];

    const pushToGroup = (key, prod) => {
      if (!groups[key]) order.push(key);
      groups[key] = [...(groups[key] || []), prod];
    };

    products.forEach((prod) => {
      const primarySub =
        normalizeId(prod.subcategoryId) ||
        normalizeId(prod.subcategoryIds?.[0]) ||
        "";

      if (!primarySub) {
        pushToGroup("Unassigned", prod);
        return;
      }

      const name = subcategoryLookup.get(primarySub)?.name || "Unassigned";
      pushToGroup(name, prod);
    });

    if (order.length === 0 && products.length) {
      order.push("All Products");
      groups["All Products"] = [...products];
    }

    return { groups, order };
  }, [products, subcategoryLookup]);

  const positionById = useMemo(() => {
    const map = new Map();
    products.forEach((p, idx) => map.set(p._id, idx + 1));
    return map;
  }, [products]);

  const subcategoryPositionById = useMemo(() => {
    const map = new Map();
    categorySubcategories.forEach((s, idx) => map.set(s._id, idx + 1));
    return map;
  }, [categorySubcategories]);

  const shouldGroupBySubcategory = useMemo(() => {
    if (!selectedCategoryObj?.hasSubcategory) return false;
    return groupedBySubcategory.order.length > 0;
  }, [groupedBySubcategory.order.length, selectedCategoryObj]);

  const idToGroup = useMemo(() => {
    const map = new Map();
    groupedBySubcategory.order.forEach((name) => {
      (groupedBySubcategory.groups[name] || []).forEach((p) => {
        map.set(p._id, name);
      });
    });
    return map;
  }, [groupedBySubcategory]);

  const formatPrice = (value) => `?${(Number(value) || 0).toLocaleString("en-IN")}`;

  const renderProductRow = (item, position, handleProps) => (
    <>
      <td className="p-3 border">
        <div
          ref={handleProps.setActivatorNodeRef}
          {...handleProps.listeners}
          className={`inline-flex items-center justify-center rounded border px-2 py-1 text-gray-500 ${
            saving ? "cursor-not-allowed" : "cursor-grab"
          }`}
          title={saving ? "Saving..." : "Drag to reorder"}
        >
          <GripVertical size={16} />
        </div>
      </td>
      <td className="p-3 border text-gray-700 font-semibold">{position}</td>
      <td className="p-3 border">
        <img
          src={withBase(item.image)}
          alt={item.name}
          className="w-12 h-12 rounded object-cover border"
        />
      </td>
      <td className="p-3 border font-medium text-gray-800">{item.name || "Untitled"}</td>
      <td className="p-3 border text-green-700 font-semibold">{formatPrice(item.price)}</td>
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
          {item.stock > 0 ? "Available" : "Out of Stock"}
        </button>
      </td>
      <td className="p-3 border text-gray-600">{item.moq ?? "N/A"}</td>
    </>
  );

  const renderSubcategoryRow = (item, position, handleProps) => (
    <>
      <td className="p-3 border">
        <div
          ref={handleProps.setActivatorNodeRef}
          {...handleProps.listeners}
          className={`inline-flex items-center justify-center rounded border px-2 py-1 text-gray-500 ${
            saving ? "cursor-not-allowed" : "cursor-grab"
          }`}
          title={saving ? "Saving..." : "Drag to reorder"}
        >
          <GripVertical size={16} />
        </div>
      </td>
      <td className="p-3 border text-gray-700 font-semibold">{position}</td>
      <td className="p-3 border">
        <img
          src={withBase(item.image)}
          alt={item.name}
          className="w-12 h-12 rounded object-cover border"
        />
      </td>
      <td className="p-3 border font-medium text-gray-800">{item.name || "Untitled"}</td>
      <td className="p-3 border text-gray-600">{selectedCategoryObj?.name || "-"}</td>
    </>
  );

  const SortableRow = ({ item, children, container }) => {
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({
      id: item._id,
      data: { container: container || idToGroup.get(item._id) || "All Products" },
      disabled: saving,
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.6 : 1,
      cursor: saving ? "not-allowed" : "grab",
    };

    return (
      <tr ref={setNodeRef} style={style} {...attributes} className="bg-white">
        {children({ listeners, setActivatorNodeRef })}
      </tr>
    );
  };

  const handleProductDragEnd = async (event) => {
    if (saving) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const sourceGroup = idToGroup.get(active.id);
    const targetGroup = idToGroup.get(over.id);

    if (!sourceGroup || sourceGroup !== targetGroup) return;

    const currentGroup = groupedBySubcategory.groups[sourceGroup] || [];
    const oldIndex = currentGroup.findIndex((p) => p._id === active.id);
    const newIndex = currentGroup.findIndex((p) => p._id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const updatedGroup = arrayMove(currentGroup, oldIndex, newIndex);

    const rebuilt = [];
    groupedBySubcategory.order.forEach((name) => {
      const list = name === sourceGroup ? updatedGroup : groupedBySubcategory.groups[name] || [];
      rebuilt.push(...list);
    });

    const payload = rebuilt.map((p, idx) => ({ id: p._id, position: idx + 1 }));
    const prev = products;
    setProducts(rebuilt);
    setSaving(true);
    try {
      await axios.patch(`${API_BASE}/api/admin/product/positions`, payload, {
        headers: { ...adminHeaders(), "Content-Type": "application/json" },
      });
      if (selectedCategory) {
        await fetchCategoryProducts(selectedCategory);
      }
    } catch (error) {
      console.log("Positions update error:", error?.response?.data || error);
      setProducts(prev);
      alert(error?.response?.data?.message || "Unable to update positions");
    } finally {
      setSaving(false);
    }
  };

  const handleSubcategoryDragEnd = async (event) => {
    if (saving) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = categorySubcategories.findIndex((s) => s._id === active.id);
    const newIndex = categorySubcategories.findIndex((s) => s._id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(categorySubcategories, oldIndex, newIndex);
    const payload = reordered.map((s, idx) => ({ id: s._id, position: idx + 1 }));
    const payloadMap = new Map(payload.map((p) => [p.id, p.position]));

    const prev = subcategories;
    setSubcategories((current) =>
      current.map((s) => {
        const id = normalizeId(s._id);
        if (!payloadMap.has(id)) return s;
        return { ...s, position: payloadMap.get(id) };
      })
    );

    setSaving(true);
    try {
      await axios.patch(
        `${API_BASE}/api/admin/subcategory/positions?mode=${resolvedMode}`,
        { categoryId: selectedCategory, positions: payload },
        { headers: { ...adminHeaders(), "Content-Type": "application/json" } }
      );
      await fetchMeta();
    } catch (error) {
      console.log("Subcategory positions update error:", error?.response?.data || error);
      setSubcategories(prev);
      alert(error?.response?.data?.message || "Unable to update subcategory positions");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full bg-red-500 text-white p-6 rounded-b-xl mb-6">
        <h1 className="text-4xl font-bold heading-font">POSITIONS</h1>
        <p className="text-sm text-red-50 mt-1">
          Pick a category, then reorder products or subcategories exactly as they should appear in the app.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
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

        <div className="flex items-center gap-3 mb-4">
          <span className="text-sm text-gray-600">Position Type:</span>
          <button
            type="button"
            onClick={() => setPositionType("products")}
            className={`px-3 py-1 rounded-full text-sm border ${
              positionType === "products"
                ? "bg-red-500 text-white border-red-500"
                : "bg-white text-gray-700"
            }`}
          >
            Products
          </button>
          <button
            type="button"
            onClick={() => setPositionType("subcategories")}
            className={`px-3 py-1 rounded-full text-sm border ${
              positionType === "subcategories"
                ? "bg-red-500 text-white border-red-500"
                : "bg-white text-gray-700"
            }`}
          >
            Subcategories
          </button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="font-semibold text-gray-700">Select Category</label>
            <select
              className="w-full border p-2 rounded mt-1"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">-- Choose a category --</option>
              {categories.map((cat) => (
                <option key={cat._id} value={normalizeId(cat._id)}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {
              fetchMeta();
              if (positionType === "products" && selectedCategory) {
                fetchCategoryProducts(selectedCategory);
              }
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg border"
            disabled={loading || saving}
          >
            {loading ? "Refreshing..." : saving ? "Saving..." : "Refresh"}
          </button>
        </div>

        {!selectedCategory && (
          <div className="text-gray-500 mt-6">Select a category to manage positions.</div>
        )}

        {selectedCategory && positionType === "products" && products.length === 0 && (
          <div className="text-gray-500 mt-6">No products found for this category.</div>
        )}

        {selectedCategory && positionType === "subcategories" && categorySubcategories.length === 0 && (
          <div className="text-gray-500 mt-6">No subcategories found for this category.</div>
        )}

        {selectedCategory && positionType === "products" && products.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleProductDragEnd}
          >
            <div className="mt-6 space-y-6">
              {shouldGroupBySubcategory ? (
                groupedBySubcategory.order.map((subName) => (
                  <div key={subName} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">{subName}</h3>
                      <span className="text-xs text-gray-500">{groupedBySubcategory.groups[subName]?.length || 0} product(s)</span>
                    </div>
                    <SortableContext
                      items={(groupedBySubcategory.groups[subName] || []).map((p) => p._id)}
                      strategy={verticalListSortingStrategy}
                    >
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-100 text-left">
                              <th className="p-3 border">Move</th>
                              <th className="p-3 border">Position</th>
                              <th className="p-3 border">Image</th>
                              <th className="p-3 border">Product</th>
                              <th className="p-3 border">Price</th>
                              <th className="p-3 border">Stock</th>
                              <th className="p-3 border">MOQ</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(groupedBySubcategory.groups[subName] || []).map((prod) => (
                              <SortableRow key={prod._id} item={prod}>
                                {(handleProps) =>
                                  renderProductRow(prod, positionById.get(prod._id) || "-", handleProps)
                                }
                              </SortableRow>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </SortableContext>
                  </div>
                ))
              ) : (
                <SortableContext
                  items={products.map((p) => p._id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="overflow-x-auto">
                    {selectedCategoryObj?.hasSubcategory && (
                      <div className="text-gray-500 mb-3">
                        No subcategory grouping found for this category. Showing products in app position order.
                      </div>
                    )}
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-gray-100 text-left">
                          <th className="p-3 border">Move</th>
                          <th className="p-3 border">Position</th>
                          <th className="p-3 border">Image</th>
                          <th className="p-3 border">Product</th>
                          <th className="p-3 border">Price</th>
                          <th className="p-3 border">Stock</th>
                          <th className="p-3 border">MOQ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((prod) => (
                          <SortableRow key={prod._id} item={prod}>
                            {(handleProps) =>
                              renderProductRow(prod, positionById.get(prod._id) || "-", handleProps)
                            }
                          </SortableRow>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </SortableContext>
              )}
            </div>
          </DndContext>
        )}

        {selectedCategory && positionType === "subcategories" && categorySubcategories.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleSubcategoryDragEnd}
          >
            <div className="mt-6">
              <div className="text-sm text-gray-600 mb-3">
                Reorder subcategories to control left-panel/app display order.
              </div>
              <SortableContext
                items={categorySubcategories.map((s) => s._id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-left">
                        <th className="p-3 border">Move</th>
                        <th className="p-3 border">Position</th>
                        <th className="p-3 border">Image</th>
                        <th className="p-3 border">Subcategory</th>
                        <th className="p-3 border">Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categorySubcategories.map((sub) => (
                        <SortableRow key={sub._id} item={sub} container="SUBCATEGORIES">
                          {(handleProps) =>
                            renderSubcategoryRow(
                              sub,
                              subcategoryPositionById.get(sub._id) || "-",
                              handleProps
                            )
                          }
                        </SortableRow>
                      ))}
                    </tbody>
                  </table>
                </div>
              </SortableContext>
            </div>
          </DndContext>
        )}
      </div>
    </div>
  );
}

