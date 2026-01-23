import { Sun, Bell, User } from "lucide-react";

export default function Topbar() {
  return (
    <div className="w-full bg-white h-16 flex items-center justify-between px-6 border-b shadow-sm">
      {/* Tabs */}
      <div className="flex items-center gap-6">
        {["Home", "Dashboard", "Product", "Category", "Slider", "Promo Code"].map(
          (tab) => (
            <button
              key={tab}
              className="text-gray-600 hover:text-purple-600 transition-all font-medium"
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-5">
        <Bell size={22} className="text-gray-600 hover:text-purple-600 cursor-pointer" />
        <Sun size={22} className="text-gray-600 hover:text-purple-600 cursor-pointer" />
        <div className="flex items-center gap-2 cursor-pointer">
          <User size={20} className="text-gray-600" />
          <span className="text-sm text-gray-700 font-medium">Admin</span>
        </div>
      </div>
    </div>
  );
}
