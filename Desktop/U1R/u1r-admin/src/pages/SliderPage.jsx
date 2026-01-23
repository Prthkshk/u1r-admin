import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE, withBase } from "../config/api";
import { Trash2 } from "lucide-react";

export default function SliderPage() {
  const [sliders, setSliders] = useState([]);

  const [image, setImage] = useState(null);
  const [redirectLink, setRedirectLink] = useState("");
  const [priority, setPriority] = useState(1);
  const [active, setActive] = useState(true);

  const fetchSliders = async () => {
    const token = localStorage.getItem("adminToken");

    const res = await axios.get(`${API_BASE}/api/admin/slider`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setSliders(res.data);
  };

  useEffect(() => {
    fetchSliders();
  }, []);

  const handleAdd = async () => {
    if (!image) {
      alert("Slider image is required");
      return;
    }

    const token = localStorage.getItem("adminToken");
    const form = new FormData();

    form.append("image", image);
    form.append("redirectLink", redirectLink);
    form.append("priority", priority);
    form.append("active", active);

    await axios.post(
      `${API_BASE}/api/admin/slider/create`,
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    alert("Slider created!");
    fetchSliders();
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete slider?")) return;

    const token = localStorage.getItem("adminToken");

    await axios.delete(`${API_BASE}/api/admin/slider/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    fetchSliders();
  };

  return (
    <div className="w-full">

      <div className="w-full bg-red-500 text-white p-6 rounded-b-xl mb-6">
        <h1 className="text-4xl font-bold heading-font">CREATE SLIDER</h1>
      </div>

      <div className="bg-white p-6 shadow-md rounded-xl mb-6">

        <h2 className="text-xl font-semibold mb-4">Add Slider</h2>

        <div className="grid grid-cols-3 gap-4">

          <div>
            <label className="font-semibold">Redirect Link</label>
            <input
              className="border p-2 rounded w-full"
              placeholder="/category/almonds"
              value={redirectLink}
              onChange={(e) => setRedirectLink(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold">Priority</label>
            <input
              type="number"
              className="border p-2 rounded w-full"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            />
          </div>

          <div>
            <label className="font-semibold">Active?</label>
            <select
              className="border p-2 rounded w-full"
              value={active}
              onChange={(e) => setActive(e.target.value === "true")}
            >
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>

          <div>
            <label className="font-semibold">Slider Image*</label>
            <input
              type="file"
              className="border p-2 rounded w-full"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

        </div>

        <button
          onClick={handleAdd}
          className="mt-6 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
        >
          Add Slider
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white p-6 rounded-xl shadow-md">

        <h2 className="text-xl font-semibold mb-4">All Sliders</h2>

        <div className="overflow-x-auto">
          <table className="w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border">Sno</th>
                <th className="p-3 border">Image</th>
                <th className="p-3 border">Priority</th>
                <th className="p-3 border">Active</th>
                <th className="p-3 border">Link</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {sliders.map((s, i) => (
                <tr key={s._id} className="text-center hover:bg-gray-50">

                  <td className="p-3 border font-semibold">#{i + 1}</td>

                  <td className="p-3 border">
                    <img
                      src={withBase(s.image)}
                      className="w-20 h-20 object-cover rounded mx-auto"
                    />
                  </td>

                  <td className="p-3 border">{s.priority}</td>

                  <td className="p-3 border">
                    {s.active ? "Active" : "Inactive"}
                  </td>

                  <td className="p-3 border">{s.redirectLink || "—"}</td>

                  <td className="p-3 border">
                    <button
                      onClick={() => handleDelete(s._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={20} />
                    </button>
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
