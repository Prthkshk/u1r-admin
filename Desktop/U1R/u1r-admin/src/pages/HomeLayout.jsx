import { useEffect, useMemo, useState } from "react";
import axios from "axios";
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
  const isWebsitePage = !mode;
  const normalizeId = (value) => String(value || "").trim();
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
  const [websiteBanners, setWebsiteBanners] = useState([]);
  const [websiteBannerFiles, setWebsiteBannerFiles] = useState([]);
  const [websitePromoBanners, setWebsitePromoBanners] = useState([]);
  const [websitePromoBannerFiles, setWebsitePromoBannerFiles] = useState([]);
  const [websiteStretchBannerFile, setWebsiteStretchBannerFile] = useState(null);
  const [websiteStretchBannerPreview, setWebsiteStretchBannerPreview] = useState("");
  const [websiteCategoryBannerFile, setWebsiteCategoryBannerFile] = useState(null);
  const [websiteCategoryBannerSourceType, setWebsiteCategoryBannerSourceType] = useState("category");
  const [websiteCategoryBannerCategoryId, setWebsiteCategoryBannerCategoryId] = useState("");
  const [websiteCategoryBannerSubcategoryId, setWebsiteCategoryBannerSubcategoryId] = useState("");
  const [websiteCategoryBanners, setWebsiteCategoryBanners] = useState([]);
  const [websiteCategoryOptions, setWebsiteCategoryOptions] = useState([]);
  const [websiteSubcategoryOptions, setWebsiteSubcategoryOptions] = useState([]);
  const [websiteSelectedSubcategoryIds, setWebsiteSelectedSubcategoryIds] = useState([]);
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
    const websiteBannerData = Array.isArray(res.data?.websiteBanners)
      ? [...res.data.websiteBanners]
          .filter((item) => item?.image)
          .sort((a, b) => Number(a?.priority || 0) - Number(b?.priority || 0))
      : [];
    setWebsiteBanners(websiteBannerData);
    const websitePromoBannerData = Array.isArray(res.data?.websitePromoBanners)
      ? [...res.data.websitePromoBanners]
          .filter((item) => item?.image)
          .sort((a, b) => Number(a?.priority || 0) - Number(b?.priority || 0))
      : [];
    setWebsitePromoBanners(websitePromoBannerData);
    setWebsitePromoBannerFiles([]);
    const stretchBannerImage = res.data?.websiteStretchBanner?.image || "";
    setWebsiteStretchBannerPreview(stretchBannerImage ? withBase(stretchBannerImage) : "");
    setWebsiteStretchBannerFile(null);
    const websiteCategoryBannerData = Array.isArray(res.data?.websiteCategoryBanners)
      ? [...res.data.websiteCategoryBanners]
          .filter((item) => item?.image)
          .sort((a, b) => Number(a?.priority || 0) - Number(b?.priority || 0))
      : [];
    setWebsiteCategoryBanners(websiteCategoryBannerData);
    setWebsiteCategoryBannerFile(null);
    const websiteSubcategoryData = Array.isArray(res.data?.websiteSubcategories)
      ? [...res.data.websiteSubcategories]
          .filter((item) => item?.subcategoryId)
          .sort((a, b) => Number(a?.priority || 0) - Number(b?.priority || 0))
      : [];
    setWebsiteSelectedSubcategoryIds(
      websiteSubcategoryData
        .map((item) => item?.subcategoryId?._id || item?.subcategoryId)
        .map((id) => normalizeId(id))
        .filter(Boolean)
    );
    setWebsiteBannerFiles([]);
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

  const fetchWebsiteSubcategoryOptions = async () => {
    const token = localStorage.getItem("adminToken");
    const res = await axios.get(`${API_BASE}/api/admin/subcategory?mode=retail`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setWebsiteSubcategoryOptions(res.data || []);
  };

  const fetchWebsiteCategoryOptions = async () => {
    const token = localStorage.getItem("adminToken");
    const res = await axios.get(`${API_BASE}/api/admin/category?mode=retail`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setWebsiteCategoryOptions(res.data || []);
  };

  useEffect(() => {
    fetchLayout();
    fetchCategories();
    fetchSubcategories();
    if (isWebsitePage) {
      fetchWebsiteCategoryOptions();
      fetchWebsiteSubcategoryOptions();
    }
  }, [resolvedMode, isWebsitePage]);

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

  const saveWebsiteBanners = async () => {
    const token = localStorage.getItem("adminToken");
    const form = new FormData();
    const keepImages = websiteBanners.map((item) => item?.image).filter(Boolean);

    form.append("keepImages", JSON.stringify(keepImages));
    websiteBannerFiles.forEach((file) => {
      form.append("images", file);
    });

    const res = await axios.put(
      `${API_BASE}/api/admin/home-layout/website-banners`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const nextBanners = Array.isArray(res?.data?.websiteBanners)
      ? [...res.data.websiteBanners]
          .filter((item) => item?.image)
          .sort((a, b) => Number(a?.priority || 0) - Number(b?.priority || 0))
      : [];
    setWebsiteBanners(nextBanners);
    setWebsiteBannerFiles([]);
    alert("Website banners updated!");
  };

  const toggleWebsiteSubcategory = (id) => {
    const normalizedId = normalizeId(id);
    if (!normalizedId) return;
    setWebsiteSelectedSubcategoryIds((prev) =>
      prev.includes(normalizedId)
        ? prev.filter((item) => item !== normalizedId)
        : [...prev, normalizedId]
    );
  };

  const saveWebsiteSubcategories = async () => {
    const token = localStorage.getItem("adminToken");

    await axios.put(
      `${API_BASE}/api/admin/home-layout/website-subcategories`,
      {
        subcategoryIds: websiteSelectedSubcategoryIds
          .map((id) => normalizeId(id))
          .filter(Boolean),
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Website subcategories updated!");
  };

  const saveWebsitePromoBanners = async () => {
    const token = localStorage.getItem("adminToken");
    const form = new FormData();
    const keepImages = websitePromoBanners.map((item) => item?.image).filter(Boolean);

    form.append("keepImages", JSON.stringify(keepImages));
    websitePromoBannerFiles.forEach((file) => {
      form.append("images", file);
    });

    const res = await axios.put(
      `${API_BASE}/api/admin/home-layout/website-promo-banners`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const nextBanners = Array.isArray(res?.data?.websitePromoBanners)
      ? [...res.data.websitePromoBanners]
          .filter((item) => item?.image)
          .sort((a, b) => Number(a?.priority || 0) - Number(b?.priority || 0))
      : [];
    setWebsitePromoBanners(nextBanners);
    setWebsitePromoBannerFiles([]);
    alert("Website promo banners updated!");
  };

  const saveWebsiteStretchBanner = async () => {
    if (!websiteStretchBannerFile) {
      alert("Please choose a stretch banner image");
      return;
    }

    const token = localStorage.getItem("adminToken");
    const form = new FormData();
    form.append("image", websiteStretchBannerFile);

    const res = await axios.put(
      `${API_BASE}/api/admin/home-layout/website-stretch-banner`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const nextImage = res?.data?.websiteStretchBanner?.image || "";
    setWebsiteStretchBannerPreview(nextImage ? withBase(nextImage) : "");
    setWebsiteStretchBannerFile(null);
    alert("Website stretch banner updated!");
  };

  const saveWebsiteCategoryBanner = async () => {
    if (!websiteCategoryBannerFile) {
      alert("Please choose a banner image");
      return;
    }
    if (websiteCategoryBannerSourceType === "category" && !websiteCategoryBannerCategoryId) {
      alert("Please select a category");
      return;
    }
    if (websiteCategoryBannerSourceType === "subcategory" && !websiteCategoryBannerSubcategoryId) {
      alert("Please select a subcategory");
      return;
    }

    const token = localStorage.getItem("adminToken");
    const form = new FormData();
    form.append("image", websiteCategoryBannerFile);
    form.append("sourceType", websiteCategoryBannerSourceType);
    if (websiteCategoryBannerSourceType === "category") {
      form.append("categoryId", websiteCategoryBannerCategoryId);
    } else {
      form.append("subcategoryId", websiteCategoryBannerSubcategoryId);
    }

    const res = await axios.post(
      `${API_BASE}/api/admin/home-layout/website-category-banners`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const next = Array.isArray(res?.data?.websiteCategoryBanners)
      ? [...res.data.websiteCategoryBanners]
          .filter((item) => item?.image)
          .sort((a, b) => Number(a?.priority || 0) - Number(b?.priority || 0))
      : [];
    setWebsiteCategoryBanners(next);
    setWebsiteCategoryBannerFile(null);
    alert("Website category banner added!");
  };

  const deleteWebsiteCategoryBanner = async (bannerId) => {
    const token = localStorage.getItem("adminToken");
    const res = await axios.delete(
      `${API_BASE}/api/admin/home-layout/website-category-banners/${bannerId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const next = Array.isArray(res?.data?.websiteCategoryBanners)
      ? [...res.data.websiteCategoryBanners]
          .filter((item) => item?.image)
          .sort((a, b) => Number(a?.priority || 0) - Number(b?.priority || 0))
      : [];
    setWebsiteCategoryBanners(next);
  };

  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="w-full bg-red-500 text-white p-6 rounded-b-xl mb-6">
        <h1 className="text-4xl heading-font font-bold">HOME LAYOUT</h1>
      </div>

      {isWebsitePage && (
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2">Website Hero Banner</h2>
        <p className="text-sm text-gray-500 mb-4">
          Upload one or more banners. These images will show on the website home page.
        </p>

        <div className="grid grid-cols-2 gap-6 items-start">
          <div>
            <label className="font-semibold block mb-2">Banner Images</label>
            <input
              type="file"
              multiple
              className="border p-2 rounded w-full"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (!files.length) return;
                setWebsiteBannerFiles((prev) => [...prev, ...files]);
              }}
            />
            {!!websiteBannerFiles.length && (
              <div className="mt-3 text-sm text-gray-700 space-y-1">
                {websiteBannerFiles.map((file, idx) => (
                  <div key={`${file.name}-${idx}`} className="flex items-center justify-between gap-2">
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      className="text-xs text-red-600 hover:underline"
                      onClick={() =>
                        setWebsiteBannerFiles((prev) => prev.filter((_, i) => i !== idx))
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={saveWebsiteBanners}
              className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
            >
              Save Website Banners
            </button>
          </div>

          <div>
            <div className="font-semibold mb-2">Current Banners</div>
            {!!websiteBanners.length ? (
              <div className="grid grid-cols-2 gap-3 max-h-[360px] overflow-auto pr-1">
                {websiteBanners.map((item, idx) => (
                  <div key={`${item.image}-${idx}`} className="border rounded-lg p-2">
                    <img
                      src={withBase(item.image)}
                      className="w-full h-28 rounded object-cover border"
                    />
                    <button
                      type="button"
                      className="mt-2 text-xs text-red-600 hover:underline"
                      onClick={() =>
                        setWebsiteBanners((prev) =>
                          prev.filter((banner) => banner.image !== item.image)
                        )
                      }
                    >
                      Remove Banner
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">No website banners added.</div>
            )}
          </div>
        </div>
      </div>
      )}

      {isWebsitePage && (
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2">Website Promo Banners</h2>
        <p className="text-sm text-gray-500 mb-4">
          Upload one or more promo banners for the website home page.
        </p>

        <div className="grid grid-cols-2 gap-6 items-start">
          <div>
            <label className="font-semibold block mb-2">Promo Banner Images</label>
            <input
              type="file"
              multiple
              className="border p-2 rounded w-full"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                if (!files.length) return;
                setWebsitePromoBannerFiles((prev) => [...prev, ...files]);
              }}
            />
            {!!websitePromoBannerFiles.length && (
              <div className="mt-3 text-sm text-gray-700 space-y-1">
                {websitePromoBannerFiles.map((file, idx) => (
                  <div key={`${file.name}-${idx}`} className="flex items-center justify-between gap-2">
                    <span className="truncate">{file.name}</span>
                    <button
                      type="button"
                      className="text-xs text-red-600 hover:underline"
                      onClick={() =>
                        setWebsitePromoBannerFiles((prev) => prev.filter((_, i) => i !== idx))
                      }
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={saveWebsitePromoBanners}
              className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
            >
              Save Promo Banners
            </button>
          </div>

          <div>
            <div className="font-semibold mb-2">Current Promo Banners</div>
            {!!websitePromoBanners.length ? (
              <div className="grid grid-cols-2 gap-3 max-h-[360px] overflow-auto pr-1">
                {websitePromoBanners.map((item, idx) => (
                  <div key={`${item.image}-${idx}`} className="border rounded-lg p-2">
                    <img
                      src={withBase(item.image)}
                      className="w-full h-28 rounded object-cover border"
                    />
                    <button
                      type="button"
                      className="mt-2 text-xs text-red-600 hover:underline"
                      onClick={() =>
                        setWebsitePromoBanners((prev) =>
                          prev.filter((banner) => banner.image !== item.image)
                        )
                      }
                    >
                      Remove Banner
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-gray-500">No promo banners added.</div>
            )}
          </div>
        </div>
      </div>
      )}

      {isWebsitePage && (
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2">Website Subcategory Section</h2>
        <p className="text-sm text-gray-500 mb-4">
          Select subcategories to show on the website home page.
        </p>

        <div className="grid grid-cols-3 gap-3 max-h-[360px] overflow-auto">
          {websiteSubcategoryOptions.map((sub) => (
            <label
              key={sub._id}
              className="flex items-center gap-3 border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={websiteSelectedSubcategoryIds.includes(normalizeId(sub._id))}
                onChange={() => toggleWebsiteSubcategory(sub._id)}
              />
              <div>
                <div className="font-semibold text-sm">{sub.name}</div>
                <div className="text-xs text-gray-500">
                  {sub.categoryId?.name || "Unassigned"}
                </div>
              </div>
            </label>
          ))}
          {!websiteSubcategoryOptions.length && (
            <div className="text-sm text-gray-500">No subcategories found.</div>
          )}
        </div>

        <button
          onClick={saveWebsiteSubcategories}
          className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
        >
          Save Website Subcategories
        </button>
      </div>
      )}

      {isWebsitePage && (
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2">Website Stretch Banner</h2>
        <p className="text-sm text-gray-500 mb-4">
          Upload a single full-width banner to show after website subcategories.
        </p>

        <div className="grid grid-cols-2 gap-6 items-start">
          <div>
            <label className="font-semibold block mb-2">Stretch Banner Image</label>
            <input
              type="file"
              className="border p-2 rounded w-full"
              onChange={(e) => setWebsiteStretchBannerFile(e.target.files?.[0] || null)}
            />
            <button
              onClick={saveWebsiteStretchBanner}
              className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
            >
              Save Stretch Banner
            </button>
          </div>

          <div>
            <div className="font-semibold mb-2">Preview</div>
            {websiteStretchBannerPreview ? (
              <img
                src={websiteStretchBannerPreview}
                className="w-full max-w-2xl rounded-lg border object-cover"
              />
            ) : (
              <div className="text-sm text-gray-500">No stretch banner uploaded.</div>
            )}
          </div>
        </div>
      </div>
      )}

      {isWebsitePage && (
      <div className="bg-white p-6 rounded-xl shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-2">Website Category/Subcategory Banners</h2>
        <p className="text-sm text-gray-500 mb-4">
          Add banner and target a category or subcategory. It will show on that page on website.
        </p>

        <div className="grid grid-cols-3 gap-4 items-end">
          <div>
            <label className="font-semibold block mb-2">Target Type</label>
            <select
              className="w-full border rounded px-3 py-2"
              value={websiteCategoryBannerSourceType}
              onChange={(e) => setWebsiteCategoryBannerSourceType(e.target.value)}
            >
              <option value="category">Category</option>
              <option value="subcategory">Subcategory</option>
            </select>
          </div>
          <div>
            <label className="font-semibold block mb-2">
              {websiteCategoryBannerSourceType === "subcategory" ? "Subcategory" : "Category"}
            </label>
            {websiteCategoryBannerSourceType === "subcategory" ? (
              <select
                className="w-full border rounded px-3 py-2"
                value={websiteCategoryBannerSubcategoryId}
                onChange={(e) => setWebsiteCategoryBannerSubcategoryId(e.target.value)}
              >
                <option value="">Select subcategory</option>
                {websiteSubcategoryOptions.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name} ({sub.categoryId?.name || "Unassigned"})
                  </option>
                ))}
              </select>
            ) : (
              <select
                className="w-full border rounded px-3 py-2"
                value={websiteCategoryBannerCategoryId}
                onChange={(e) => setWebsiteCategoryBannerCategoryId(e.target.value)}
              >
                <option value="">Select category</option>
                {websiteCategoryOptions.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div>
            <label className="font-semibold block mb-2">Banner Image</label>
            <input
              type="file"
              className="border p-2 rounded w-full"
              onChange={(e) => setWebsiteCategoryBannerFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        <button
          onClick={saveWebsiteCategoryBanner}
          className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
        >
          Add Category Banner
        </button>

        <div className="mt-6">
          <div className="font-semibold mb-2">Mapped Banners</div>
          {!!websiteCategoryBanners.length ? (
            <div className="grid grid-cols-2 gap-3 max-h-[420px] overflow-auto pr-1">
              {websiteCategoryBanners.map((item) => (
                <div key={item._id || item.image} className="border rounded-lg p-2">
                  <img
                    src={withBase(item.image)}
                    className="w-full h-28 rounded object-cover border"
                  />
                  <div className="mt-2 text-xs text-gray-700">
                    Target: {item.sourceType === "subcategory" ? "Subcategory" : "Category"}{" "}
                    {item.sourceType === "subcategory"
                      ? item.subcategoryId?.name || "N/A"
                      : item.categoryId?.name || "N/A"}
                  </div>
                  <button
                    type="button"
                    className="mt-2 text-xs text-red-600 hover:underline"
                    onClick={() => deleteWebsiteCategoryBanner(item._id)}
                  >
                    Remove Banner
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">No category banners mapped yet.</div>
          )}
        </div>
      </div>
      )}

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
      ) : null}
    </div>
  );
}
