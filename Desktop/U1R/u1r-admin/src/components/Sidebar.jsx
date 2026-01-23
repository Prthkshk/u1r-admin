import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Folder,
  ShoppingBag,
  Package,
  Tag,
  Bell,
  Home,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Store
} from "lucide-react";

export default function Sidebar() {
  const { pathname } = useLocation();
  const [openMenu, setOpenMenu] = useState("");

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? "" : menu);
  };

  const isActive = (path) => pathname === path;

  return (
    <div className="w-64 h-screen bg-white border-r shadow-sm overflow-y-auto">

      {/* LOGO */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-gray-800 tracking-wide">U1R</h1>
        <p className="text-xs text-gray-500 -mt-1">Under One Roof</p>
      </div>

      <nav className="p-3">

        {/* ======================= DASHBOARD ======================= */}
        <Link
          to="/admin/dashboard"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition 
            ${isActive("/admin/dashboard") ? "bg-red-500 text-white" : "hover:bg-gray-100"}
          `}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>


        {/* ======================= WHOLESALE SECTION ======================= */}
        <h2 className="px-4 mt-4 mb-2 text-xs font-semibold text-gray-500">WHOLESALE</h2>

        {/* USERS */}
        <Link
          to="/admin/wholesale/users"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer ${
            isActive("/admin/wholesale/users") ? "bg-red-100 text-red-600" : "hover:bg-gray-100"
          }`}
        >
          <Users size={18} />
          Users
        </Link>

        {/* CATEGORIES */}
        <div>
          <div
            onClick={() => toggleMenu("wh_cat")}
            className="flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <Folder size={18} />
              Categories
            </div>
            {openMenu === "wh_cat" ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>

          {openMenu === "wh_cat" && (
            <div className="ml-10 mt-1 flex flex-col gap-1">
              <Link
                to="/admin/wholesale/categories"
                className={`px-3 py-1 text-sm rounded hover:bg-gray-100 ${
                  isActive("/admin/wholesale/categories") && "bg-red-100 text-red-600"
                }`}
              >
                View Categories
              </Link>

              <Link
                to="/admin/wholesale/subcategories"
                className={`px-3 py-1 text-sm rounded hover:bg-gray-100 ${
                  isActive("/admin/wholesale/subcategories") && "bg-red-100 text-red-600"
                }`}
              >
                View Subcategories
              </Link>
            </div>
          )}
        </div>

        {/* PRODUCTS */}
        <div>
          <div
            onClick={() => toggleMenu("wh_products")}
            className="flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100"
          >
            <div className="flex items-center gap-3">
              <ShoppingBag size={18} />
              Products
            </div>
            {openMenu === "wh_products" ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          </div>

          {openMenu === "wh_products" && (
            <div className="ml-10 mt-1 flex flex-col gap-1">
              <Link
                to="/admin/wholesale/view-products"
                className={`px-3 py-1 text-sm rounded hover:bg-gray-100 ${
                  isActive("/admin/wholesale/view-products") && "bg-red-100 text-red-600"
                }`}
              >
                View Products
              </Link>

              <Link
                to="/admin/wholesale/add-product"
                className={`px-3 py-1 text-sm rounded hover:bg-gray-100 ${
                  isActive("/admin/wholesale/add-product") && "bg-red-100 text-red-600"
                }`}
              >
                Add Product
              </Link>
            </div>
          )}
        </div>

        {/* OTHER WHOLESALE OPTIONS */}
        <Link
          to="/admin/wholesale/orders"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer ${
            isActive("/admin/wholesale/orders") ? "bg-red-100 text-red-600" : "hover:bg-gray-100"
          }`}
        >
          <Package size={18} />
          Orders
        </Link>

        <Link
          to="/admin/wholesale/positions"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer ${
            isActive("/admin/wholesale/positions") ? "bg-red-100 text-red-600" : "hover:bg-gray-100"
          }`}
        >
          <Store size={18} />
          Positions
        </Link>

        <Link
          to="/admin/wholesale/request-product"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer ${
            isActive("/admin/wholesale/request-product") ? "bg-red-100 text-red-600" : "hover:bg-gray-100"
          }`}
        >
          <Tag size={18} />
          Request Product
        </Link>

        <Link
          to="/admin/wholesale/notifications"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer ${
            isActive("/admin/wholesale/notifications") ? "bg-red-100 text-red-600" : "hover:bg-gray-100"
          }`}
        >
          <Bell size={18} />
          Notifications
        </Link>

        <Link
          to="/admin/wholesale/home-layout"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer ${
            isActive("/admin/wholesale/home-layout") ? "bg-red-100 text-red-600" : "hover:bg-gray-100"
          }`}
        >
          <Home size={18} />
          Home Layout
        </Link>

        <Link
          to="/admin/wholesale/support"
          className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer ${
            isActive("/admin/wholesale/support") ? "bg-red-100 text-red-600" : "hover:bg-gray-100"
          }`}
        >
          <HelpCircle size={18} />
          Support Tickets
        </Link>

      </nav>
    </div>
  );
}
