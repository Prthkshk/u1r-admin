import { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { API_BASE } from "../config/api";

const defaultSections = [
  "slider",
  "featuredCategories",
  "featuredSubcategories",
  "featuredProducts",
  "customSections",
];

export default function HomeLayout() {
  const [layout, setLayout] = useState({ sectionsOrder: defaultSections });
  const [sections, setSections] = useState(defaultSections);
  const [loading, setLoading] = useState(true);

  const fetchLayout = async () => {
    const token = localStorage.getItem("adminToken");
    const res = await axios.get(`${API_BASE}/api/admin/home-layout`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setLayout(res.data);

    setSections(
      res.data.sectionsOrder || defaultSections
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchLayout();
  }, []);

  const sectionNames = {
    slider: "Slider Section",
    featuredCategories: "Featured Categories",
    featuredSubcategories: "Featured Subcategories",
    featuredProducts: "Featured Products",
    customSections: "Custom Sections",
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

    await axios.put(
      `${API_BASE}/api/admin/home-layout`,
      { ...layout, sectionsOrder: sections },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert("Home layout updated!");
  };

  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="w-full bg-red-500 text-white p-6 rounded-b-xl mb-6">
        <h1 className="text-4xl heading-font font-bold">HOME LAYOUT</h1>
      </div>

      {/* DRAGGABLE SECTION ORDER */}
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
    </div>
  );
}
