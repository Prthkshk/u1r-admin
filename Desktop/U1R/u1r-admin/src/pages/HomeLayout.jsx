import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { API_BASE, withBase } from "../config/api";

const defaultSections = [
  "slider",
  "featuredCategories",
  "featuredSubcategories",
  "featuredProducts",
  "customSections",
];

export default function HomeLayout({ mode }) {
  const resolvedMode = mode || "wholesale";
  const isRetail = resolvedMode === "retail";
  const initialSections = useMemo(() => {
    if (!isRetail) return defaultSections;
    return [
      "featuredSubcategories",
      "slider",
      "featuredCategories",
      "featuredProducts",
      "customSections",
    ];
  }, [isRetail]);

  const [layout, setLayout] = useState({ sectionsOrder: initialSections });
  const [sections, setSections] = useState(initialSections);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategoryIds, setSelectedSubcategoryIds] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState("");
  const [retailBannerSourceType, setRetailBannerSourceType] = useState("none");
  const [retailBannerCategoryId, setRetailBannerCategoryId] = useState("");
  const [retailBannerSubcategoryId, setRetailBannerSubcategoryId] = useState("");
  const [retailSectionCategoryIds, setRetailSectionCategoryIds] = useState([]);
  const [retailSectionSubcategoryIds, setRetailSectionSubcategoryIds] = useState([]);
  const [retailSectionTitle, setRetailSectionTitle] = useState("");
  const [retailSectionLimit, setRetailSectionLimit] = useState(6);

  const fetchLayout = async () => {
    const token = localStorage.getItem("adminToken");
    const res = await axios.get(`${API_BASE}/api/admin/home-layout`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setLayout(res.data);

    const incomingSections = res.data.sectionsOrder || initialSections;
    const normalizedSections = isRetail
      ? [
          "featuredSubcategories",
          ...incomingSections.filter((s) => s !== "featuredSubcategories"),
        ]
      : incomingSections;
    setSections(normalizedSections);

    const incomingItems = res.data?.featuredSubcategories?.items || [];
    const ids = incomingItems
      .map((item) => item?.subcategoryId?._id || item?.subcategoryId)
      .filter(Boolean);
    setSelectedSubcategoryIds(ids);

    const incomingCategories = res.data?.featuredCategories?.items || [];
    const catIds = incomingCategories
      .map((item) => item?.categoryId?._id || item?.categoryId)
      .filter(Boolean);
    setSelectedCategoryIds(catIds);

    const placeholders = res.data?.searchPlaceholders || [];
    setSearchInput(placeholders.join("\n"));
    const bannerConfig = res.data?.retailBanner || {};
    const bannerImage = bannerConfig?.image || "";
    setBannerPreview(bannerImage ? withBase(bannerImage) : "");
    setRetailBannerSourceType(bannerConfig?.sourceType || "none");
    setRetailBannerCategoryId(
      bannerConfig?.categoryId?._id || bannerConfig?.categoryId || ""
    );
    setRetailBannerSubcategoryId(
      bannerConfig?.subcategoryId?._id || bannerConfig?.subcategoryId || ""
    );
    const retailProductSection = res.data?.retailProductSection || {};
    const categoryIds = Array.isArray(retailProductSection?.categoryIds)
      ? retailProductSection.categoryIds
          .map((item) => item?._id || item)
          .filter(Boolean)
      : [];
    const subcategoryIds = Array.isArray(retailProductSection?.subcategoryIds)
      ? retailProductSection.subcategoryIds
          .map((item) => item?._id || item)
          .filter(Boolean)
      : [];
    const fallbackCategoryId =
      retailProductSection?.categoryId?._id || retailProductSection?.categoryId || "";
    const fallbackSubcategoryId =
      retailProductSection?.subcategoryId?._id || retailProductSection?.subcategoryId || "";
    setRetailSectionCategoryIds(
      categoryIds.length ? categoryIds : fallbackCategoryId ? [fallbackCategoryId] : []
    );
    setRetailSectionSubcategoryIds(
      subcategoryIds.length ? subcategoryIds : fallbackSubcategoryId ? [fallbackSubcategoryId] : []
    );
    setRetailSectionTitle(retailProductSection?.title || "");
    setRetailSectionLimit(Number(retailProductSection?.limit) || 6);
    setLoading(false);
  };

  const fetchCategories = async () => {
    const token = localStorage.getItem("adminToken");
    const res = await axios.get(
      `${API_BASE}/api/admin/category?mode=${resolvedMode}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setCategories(res.data || []);
  };

  const fetchSubcategories = async () => {
    const token = localStorage.getItem("adminToken");
    const res = await axios.get(
      `${API_BASE}/api/admin/subcategory?mode=${resolvedMode}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setSubcategories(res.data || []);
  };

  useEffect(() => {
    fetchLayout();
    fetchCategories();
    fetchSubcategories();
  }, [resolvedMode]);

  const sectionNames = {
    slider: "Slider Section",
    featuredCategories: "Featured Categories",
    featuredSubcategories: "Subcategory Slider",
    featuredProducts: "Featured Products",
    customSections: "Custom Sections",
  };

  const setFeaturedSubcategories = (ids) => {
    setLayout((prev) => ({
      ...prev,
      featuredSubcategories: {
        enabled: true,
        ...(prev?.featuredSubcategories || {}),
        items: ids.map((id, index) => ({
          subcategoryId: id,
          priority: index + 1,
        })),
      },
    }));
  };

  const toggleSubcategory = (id) => {
    setSelectedSubcategoryIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      setFeaturedSubcategories(next);
      return next;
    });
  };

  const toggleCategory = (id) => {
    setSelectedCategoryIds((prev) => {
      const next = prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id];
      return next;
    });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(sections);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSections(items);
  };

  const saveLayout = async () => {
    const token = localStorage.getItem("adminToken");

    const normalizedFeatured = selectedSubcategoryIds.map((id, index) => ({
      subcategoryId: id,
      priority: index + 1,
    }));
    const normalizedCategories = selectedCategoryIds.map((id, index) => ({
      categoryId: id,
      priority: index + 1,
    }));
    const normalizedPlaceholders = searchInput
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    await axios.put(
      `${API_BASE}/api/admin/home-layout`,
      {
        ...layout,
        sectionsOrder: sections,
        featuredSubcategories: {
          enabled: true,
          ...(layout?.featuredSubcategories || {}),
          items: normalizedFeatured,
        },
        featuredCategories: {
          enabled: true,
          ...(layout?.featuredCategories || {}),
          items: normalizedCategories,
        },
        retailBanner: {
          ...(layout?.retailBanner || {}),
          sourceType: retailBannerSourceType,
          categoryId:
            retailBannerSourceType === "category" && retailBannerCategoryId
              ? retailBannerCategoryId
              : null,
          subcategoryId:
            retailBannerSourceType === "subcategory" && retailBannerSubcategoryId
              ? retailBannerSubcategoryId
              : null,
        },
        searchPlaceholders: normalizedPlaceholders,
        retailProductSection: {
          enabled: Boolean(
            retailSectionCategoryIds.length || retailSectionSubcategoryIds.length
          ),
          sourceType: retailSectionSubcategoryIds.length ? "subcategory" : "category",
          categoryId: retailSectionCategoryIds[0] || null,
          subcategoryId: retailSectionSubcategoryIds[0] || null,
          categoryIds: retailSectionCategoryIds,
          subcategoryIds: retailSectionSubcategoryIds,
          title: retailSectionTitle.trim(),
          limit: Math.max(1, Number(retailSectionLimit) || 6),
        },
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Home layout updated!");
  };

  const saveRetailBanner = async () => {
    if (!bannerFile) {
      alert("Please choose a banner image");
      return;
    }
    const token = localStorage.getItem("adminToken");
    const form = new FormData();
    form.append("image", bannerFile);

    const res = await axios.put(
      `${API_BASE}/api/admin/home-layout/retail-banner`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const nextImage = res?.data?.retailBanner?.image || "";
    setBannerPreview(nextImage ? withBase(nextImage) : "");
    setBannerFile(null);
    alert("Retail banner updated!");
  };

  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="w-full bg-red-500 text-white p-6 rounded-b-xl mb-6">
        <h1 className="text-4xl heading-font font-bold">HOME LAYOUT</h1>
      </div>

      {isRetail && (
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-2">Subcategory Slider</h2>
          <p className="text-sm text-gray-500 mb-4">
            Select subcategories to show in the Home B2C slider.
          </p>

          <div className="grid grid-cols-3 gap-3 max-h-[360px] overflow-auto">
            {subcategories.map((sub) => (
              <label
                key={sub._id}
                className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={selectedSubcategoryIds.includes(sub._id)}
                  onChange={() => toggleSubcategory(sub._id)}
                />
                <div>
                  <div className="font-semibold text-sm">{sub.name}</div>
                  <div className="text-xs text-gray-500">
                    {sub.categoryId?.name || "Unassigned"}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {isRetail ? (
        <>
          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-2">Shop by Categories</h2>
            <p className="text-sm text-gray-500 mb-4">
              Select categories to show in the Home B2C grid.
            </p>

            <div className="grid grid-cols-3 gap-3 max-h-[360px] overflow-auto">
              {categories.map((cat) => (
                <label
                  key={cat._id}
                  className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategoryIds.includes(cat._id)}
                    onChange={() => toggleCategory(cat._id)}
                  />
                  <div>
                    <div className="font-semibold text-sm">{cat.name}</div>
                  </div>
                </label>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Search Bar Text</h3>
              <p className="text-sm text-gray-500 mb-3">
                Add one product name per line. These will animate in the Home B2C search bar.
              </p>
              <textarea
                className="w-full border rounded-lg p-3 min-h-[120px]"
                placeholder="Kishmish Sundekhi Indian"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>

            <div className="mt-6 border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">
                Retail Category/Subcategory Product Section
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Choose one or more categories/subcategories. Selected products will appear after
                the stretch banner in Home B2C.
              </p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-2">Categories</label>
                  <div className="max-h-[200px] overflow-auto border rounded px-3 py-2 space-y-2">
                    {categories.map((cat) => (
                      <label key={cat._id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={retailSectionCategoryIds.includes(cat._id)}
                          onChange={() =>
                            setRetailSectionCategoryIds((prev) =>
                              prev.includes(cat._id)
                                ? prev.filter((id) => id !== cat._id)
                                : [...prev, cat._id]
                            )
                          }
                        />
                        <span>{cat.name}</span>
                      </label>
                    ))}
                    {!categories.length && (
                      <div className="text-sm text-gray-500">No categories found.</div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-2">Subcategories</label>
                  <div className="max-h-[200px] overflow-auto border rounded px-3 py-2 space-y-2">
                    {subcategories.map((sub) => (
                      <label key={sub._id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={retailSectionSubcategoryIds.includes(sub._id)}
                          onChange={() =>
                            setRetailSectionSubcategoryIds((prev) =>
                              prev.includes(sub._id)
                                ? prev.filter((id) => id !== sub._id)
                                : [...prev, sub._id]
                            )
                          }
                        />
                        <span>
                          {sub.name} ({sub.categoryId?.name || "Unassigned"})
                        </span>
                      </label>
                    ))}
                    {!subcategories.length && (
                      <div className="text-sm text-gray-500">No subcategories found.</div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="font-semibold block mb-2">Section Title (Optional)</label>
                  <input
                    className="w-full border rounded px-3 py-2"
                    value={retailSectionTitle}
                    onChange={(e) => setRetailSectionTitle(e.target.value)}
                    placeholder="Exotic Nuts"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-2">Products Limit</label>
                  <input
                    type="number"
                    min="1"
                    max="24"
                    className="w-full border rounded px-3 py-2"
                    value={retailSectionLimit}
                    onChange={(e) => setRetailSectionLimit(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button
              onClick={saveLayout}
              className={`mt-6 px-6 py-2 rounded-lg text-white ${
                loading ? "bg-red-300 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
              }`}
              disabled={loading}
            >
              Save Layout
            </button>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-2">Stretch Banner (Retail)</h2>
            <p className="text-sm text-gray-500 mb-4">
              Upload a single banner to show after Bestsellers on the Home B2C screen.
            </p>

            <div className="grid grid-cols-2 gap-6 items-start">
              <div>
                <label className="font-semibold block mb-2">Banner Image</label>
                <input
                  type="file"
                  className="border p-2 rounded w-full"
                  onChange={(e) => setBannerFile(e.target.files?.[0] || null)}
                />
                <button
                  onClick={saveRetailBanner}
                  className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
                >
                  Save Banner
                </button>
              </div>

              <div>
                <div className="font-semibold mb-2">Preview</div>
                {bannerPreview ? (
                  <img
                    src={bannerPreview}
                    className="w-full max-w-md rounded-lg border object-cover"
                  />
                ) : (
                  <div className="text-sm text-gray-500">No banner uploaded.</div>
                )}
              </div>
            </div>

            <div className="mt-6 border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Banner Click Target</h3>
              <p className="text-sm text-gray-500 mb-4">
                Set a category or subcategory to open when users tap the stretch banner.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold block mb-2">Target Type</label>
                  <select
                    className="w-full border rounded px-3 py-2"
                    value={retailBannerSourceType}
                    onChange={(e) => setRetailBannerSourceType(e.target.value)}
                  >
                    <option value="none">None</option>
                    <option value="category">Category</option>
                    <option value="subcategory">Subcategory</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-2">
                    {retailBannerSourceType === "subcategory" ? "Subcategory" : "Category"}
                  </label>
                  {retailBannerSourceType === "subcategory" ? (
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={retailBannerSubcategoryId}
                      onChange={(e) => setRetailBannerSubcategoryId(e.target.value)}
                    >
                      <option value="">Select subcategory</option>
                      {subcategories.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                          {sub.name} ({sub.categoryId?.name || "Unassigned"})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={retailBannerCategoryId}
                      onChange={(e) => setRetailBannerCategoryId(e.target.value)}
                      disabled={retailBannerSourceType === "none"}
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">Reorder Home Sections</h2>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sections">
              {(provided) => (
                <ul
                  className="space-y-3"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {sections.map((section, index) => (
                    <Draggable
                      key={section}
                      draggableId={section}
                      index={index}
                    >
                      {(provided) => (
                        <li
                          className="p-4 bg-gray-100 rounded-lg border shadow cursor-pointer"
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          ref={provided.innerRef}
                        >
                          {sectionNames[section]}
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>

          <button
            onClick={saveLayout}
            className={`mt-6 px-6 py-2 rounded-lg text-white ${
              loading ? "bg-red-300 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"
            }`}
            disabled={loading}
          >
            Save Layout
          </button>
        </div>
      )}
    </div>
  );
}
