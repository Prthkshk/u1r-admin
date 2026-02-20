import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE } from "../config/api";

const STORAGE_KEY = "u1r_wholesale_weights_v1";

const loadLocalWeights = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export default function Weights() {
  const [label, setLabel] = useState("");
  const [kg, setKg] = useState("");
  const [items, setItems] = useState([]);
  const [productWeights, setProductWeights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeights = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(`${API_BASE}/api/admin/weights?mode=wholesale`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const incoming = res.data?.data ?? res.data ?? [];

        // If backend is empty but localStorage has data, migrate once
        if ((!incoming || incoming.length === 0)) {
          const local = loadLocalWeights();
          if (local.length > 0) {
            await Promise.all(
              local.map((item) =>
                axios.post(
                  `${API_BASE}/api/admin/weights`,
                  { label: item.label, kg: item.kg, mode: "wholesale" },
                  { headers: { Authorization: `Bearer ${token}` } }
                )
              )
            );
            const refreshed = await axios.get(
              `${API_BASE}/api/admin/weights?mode=wholesale`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            setItems(refreshed.data?.data ?? refreshed.data ?? []);
            return;
          }
        }

        setItems(Array.isArray(incoming) ? incoming : []);
      } catch (err) {
        console.log("Admin weights load error:", err?.response?.data || err?.message);
      }
    };
    fetchWeights();
  }, []);

  useEffect(() => {
    const fetchWeights = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.get(`${API_BASE}/api/admin/product?mode=wholesale`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const incoming = res.data?.data ?? res.data ?? [];
        const unique = Array.from(
          new Set(
            (Array.isArray(incoming) ? incoming : [])
              .map((p) => String(p?.weight ?? "").trim())
              .filter(Boolean)
          )
        ).sort((a, b) => a.localeCompare(b));
        setProductWeights(unique);
      } catch (err) {
        console.log("Weights fetch error:", err?.response?.data || err?.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeights();
  }, []);

  const normalized = useMemo(() => {
    return items
      .slice()
      .sort((a, b) => String(a.label).localeCompare(String(b.label)));
  }, [items]);

  const mappedLabels = useMemo(
    () => new Set(items.map((item) => item.label)),
    [items]
  );

  const handleAdd = () => {
    const cleanLabel = String(label || "").trim();
    const numericKg = Number(kg);
    if (!cleanLabel) {
      alert("Please enter a weight label.");
      return;
    }
    if (!Number.isFinite(numericKg) || numericKg <= 0) {
      alert("Please enter a valid weight in kg.");
      return;
    }

    const save = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const res = await axios.post(
          `${API_BASE}/api/admin/weights`,
          { label: cleanLabel, kg: numericKg, mode: "wholesale" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const saved = res.data?.data ?? res.data;
        if (saved) {
          const next = items.filter((item) => item._id !== saved._id);
          next.push(saved);
          setItems(next);
        }
        setLabel("");
        setKg("");
      } catch (err) {
        alert(err?.response?.data?.message || "Failed to save weight");
      }
    };
    save();
  };

  const handleQuickSelect = (value) => {
    setLabel(value);
    const existing = items.find((item) => item.label === value);
    if (existing) setKg(String(existing.kg));
  };

  const handleDelete = (itemLabel) => {
    const target = items.find((item) => item.label === itemLabel);
    if (!target?._id) return;
    const remove = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        await axios.delete(`${API_BASE}/api/admin/weights/${target._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setItems(items.filter((item) => item._id !== target._id));
      } catch (err) {
        alert(err?.response?.data?.message || "Failed to delete weight");
      }
    };
    remove();
  };

  return (
    <div className="w-full">
      <div className="w-full bg-red-500 text-white p-6 rounded-b-xl mb-6">
        <h1 className="text-3xl font-bold heading-font">WEIGHTS</h1>
        <p className="text-sm text-red-100 mt-1">
          Map weight labels to kilograms for wholesale checkout calculations.
        </p>
      </div>

      <div className="bg-white p-6 shadow-md rounded-xl border">
        <h2 className="text-xl font-semibold mb-4">Add Weight Mapping</h2>

        <div className="flex flex-wrap items-end gap-4 mb-6">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Label (e.g., 500g, 1 Kg)</label>
            <input
              type="text"
              className="border px-3 py-2 rounded-lg w-60"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Weight label"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">Weight in kg</label>
            <input
              type="number"
              step="0.001"
              className="border px-3 py-2 rounded-lg w-40"
              value={kg}
              onChange={(e) => setKg(e.target.value)}
              placeholder="e.g. 0.5"
            />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
          >
            Add / Update
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border">Label</th>
                <th className="p-3 border">Kg</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {normalized.length === 0 ? (
                <tr>
                  <td className="p-4 border text-center text-gray-500" colSpan={3}>
                    No weights added yet.
                  </td>
                </tr>
              ) : (
                normalized.map((item) => (
                  <tr key={item.label} className="text-center">
                    <td className="p-3 border font-medium">{item.label}</td>
                    <td className="p-3 border">{item.kg}</td>
                    <td className="p-3 border">
                      <button
                        type="button"
                        onClick={() => handleDelete(item.label)}
                        className="px-3 py-1 rounded-full text-sm bg-red-100 text-red-700 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-3">Weights From Products</h3>
          {loading ? (
            <div className="text-sm text-gray-500">Loading weights...</div>
          ) : productWeights.length === 0 ? (
            <div className="text-sm text-gray-500">
              No product weights found.
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {productWeights.map((w) => {
                const isMapped = mappedLabels.has(w);
                return (
                  <button
                    key={w}
                    type="button"
                    onClick={() => handleQuickSelect(w)}
                    className={`px-3 py-1 rounded-full text-sm border ${
                      isMapped
                        ? "bg-green-100 text-green-700 border-green-200"
                        : "bg-white text-gray-700"
                    }`}
                    title={isMapped ? "Mapped" : "Click to map"}
                  >
                    {w}
                  </button>
                );
              })}
            </div>
          )}
          <div className="text-xs text-gray-500 mt-2">
            Green weights are already mapped. Click a weight to prefill the label.
          </div>
        </div>
      </div>
    </div>
  );
}
