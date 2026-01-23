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
import { API_BASE, withBase } from "../config/api";

export default function Positions() {
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const normalizeId = (val) => (typeof val === "object" && val?._id ? val._id : val);
  const adminHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("adminToken") || ""}` });

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { pressDelay: 150, pressTolerance: 5 })
  );

  const fetchMeta = async () => {
    try {
      const [catRes, subRes] = await Promise.all([
        axios.get(`${API_BASE}/api/admin/category`, { headers: adminHeaders() }),
        axios.get(`${API_BASE}/api/admin/subcategory`, { headers: adminHeaders() }),
      ]);
      setCategories(catRes.data || []);
      setSubcategories(subRes.data || []);
    } catch (error) {
      console.log("Positions meta fetch error:", error?.response?.data || error);
      alert(error?.response?.data?.message || "Unable to load categories");
    }
  };

  const fetchCategoryProducts = async (categoryId) => {
    if (!categoryId) return;
    try {
      setLoading(true);
      // Use the same public endpoint the app uses to mirror ordering
      const res = await axios.get(`${API_BASE}/api/public/products/category/${categoryId}`);
      const incoming = res.data?.data ?? res.data ?? [];
      if (Array.isArray(incoming) && incoming.length) {
        setProducts(incoming);
        return;
      }

      // Fallback: admin endpoint (includes inactive) so admins still see everything
      const adminRes = await axios.get(`${API_BASE}/api/admin/product`, {
        headers: adminHeaders(),
      });
      const all = adminRes.data?.data ?? adminRes.data ?? [];
      const filtered = (Array.isArray(all) ? all : []).filter(
        (p) =>
          normalizeId(p.categoryId) === categoryId ||
          normalizeId(p.categoryId?._id) === categoryId
      );
      // Keep as-is to retain backend ordering when public list is empty
      setProducts(filtered);
    } catch (error) {
      console.log("Positions products fetch error:", error?.response?.data || error);
      alert(error?.response?.data?.message || "Unable to load products for category");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeta();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchCategoryProducts(selectedCategory);
    } else {
      setProducts([]);
    }
  }, [selectedCategory]);

  const selectedCategoryObj = useMemo(
    () => categories.find((c) => normalizeId(c._id) === selectedCategory),
    [categories, selectedCategory]
  );

  const subcategoryLookup = useMemo(() => {
    const map = new Map();
    subcategories.forEach((s) => {
      map.set(normalizeId(s._id), s);
    });
    return map;
  }, [subcategories]);

  const groupedBySubcategory = useMemo(() => {
    // Always build grouped lists; when category has no subcategory treat everything as one group
    const groups = {};
    const order = [];

    const pushToGroup = (key, prod) => {
      if (!groups[key]) order.push(key);
      groups[key] = [...(groups[key] || []), prod];
    };

    products.forEach((prod) => {
      const subIds =
        prod.subcategoryIds?.length
          ? prod.subcategoryIds.map(normalizeId).filter(Boolean)
          : prod.subcategoryId
          ? [normalizeId(prod.subcategoryId)]
          : [];

      if (subIds.length === 0) {
        pushToGroup("Unassigned", prod);
        return;
      }

      subIds.forEach((sid) => {
        const name = subcategoryLookup.get(sid)?.name || "Unassigned";
        pushToGroup(name, prod);
      });
    });

    if (order.length === 0 && products.length) {
      // Fallback single bucket for categories without subcategories enabled
      order.push("All Products");
      groups["All Products"] = [...products];
    }

    return { groups, order };
  }, [products, subcategoryLookup]);

  const idToGroup = useMemo(() => {
    const map = new Map();
    groupedBySubcategory.order.forEach((name) => {
      (groupedBySubcategory.groups[name] || []).forEach((p) => {
        map.set(p._id, name);
      });
    });
    return map;
  }, [groupedBySubcategory]);

  const formatPrice = (value) => `₹${(Number(value) || 0).toLocaleString("en-IN")}`;

  const renderProductCard = (item) => (
    <div
      key={item._id}
      className="border rounded-lg p-4 flex items-start gap-4 bg-white shadow-sm"
    >
      <img
        src={withBase(item.image)}
        alt={item.name}
        className="w-16 h-16 rounded object-cover border"
      />
      <div className="flex-1">
        <div className="font-semibold text-gray-800">{item.name || "Untitled"}</div>
        <div className="text-green-600 font-bold text-sm mt-1">
          {formatPrice(item.price)}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Stock: {item.stock ?? "N/A"} | MOQ: {item.moq ?? "N/A"}
        </div>
      </div>
    </div>
  );

  const SortableCard = ({ item, children }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: item._id,
      data: { container: idToGroup.get(item._id) || "All Products" },
      disabled: saving,
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.6 : 1,
      cursor: saving ? "not-allowed" : "grab",
    };

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
        {children}
      </div>
    );
  };

  const handleDragEnd = async (event) => {
    if (saving) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const sourceGroup = idToGroup.get(active.id);
    const targetGroup = idToGroup.get(over.id);

    // Only allow reordering inside the same subcategory bucket
    if (!sourceGroup || sourceGroup !== targetGroup) return;

    const currentGroup = groupedBySubcategory.groups[sourceGroup] || [];
    const oldIndex = currentGroup.findIndex((p) => p._id === active.id);
    const newIndex = currentGroup.findIndex((p) => p._id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const updatedGroup = arrayMove(currentGroup, oldIndex, newIndex);

    // Rebuild products array following the grouped order, substituting the updated group
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
      // Reload from API to confirm persistence and stay in sync
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

  return (
    <div className="w-full">

      {/* Red Header */}
      <div className="w-full bg-red-500 text-white p-6 rounded-b-xl mb-6">
        <h1 className="text-4xl font-bold heading-font">POSITIONS</h1>
        <p className="text-sm text-red-50 mt-1">
          Pick a category to see its products, grouped by subcategories when available.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-md">
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
              if (selectedCategory) fetchCategoryProducts(selectedCategory);
            }}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg border"
            disabled={loading || saving}
          >
            {loading ? "Refreshing..." : saving ? "Saving..." : "Refresh"}
          </button>
        </div>

        {!selectedCategory && (
          <div className="text-gray-500 mt-6">Select a category to view products.</div>
        )}

        {selectedCategory && products.length === 0 && (
          <div className="text-gray-500 mt-6">No products found for this category.</div>
        )}

        {selectedCategory && products.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="mt-6 space-y-6">
              {selectedCategoryObj?.hasSubcategory ? (
                groupedBySubcategory.order.length === 0 ? (
                  <div className="text-gray-500">No products mapped to subcategories.</div>
                ) : (
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
                        <div className="grid md:grid-cols-2 gap-3">
                          {(groupedBySubcategory.groups[subName] || []).map((prod) => (
                            <SortableCard key={prod._id} item={prod}>
                              {renderProductCard(prod)}
                            </SortableCard>
                          ))}
                        </div>
                      </SortableContext>
                    </div>
                  ))
                )
              ) : (
                <SortableContext
                  items={products.map((p) => p._id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="grid md:grid-cols-2 gap-3">
                    {products.map((prod) => (
                      <SortableCard key={prod._id} item={prod}>
                        {renderProductCard(prod)}
                      </SortableCard>
                    ))}
                  </div>
                </SortableContext>
              )}
            </div>
          </DndContext>
        )}
      </div>
    </div>
  );
}
