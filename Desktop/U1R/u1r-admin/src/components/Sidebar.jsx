import { NavLink } from "react-router-dom";

const Sidebar = () => {
  const sectionClass =
    "px-4 mt-6 text-xs font-semibold text-gray-400 uppercase tracking-wide";

  const linkClass = ({ isActive }) =>
    `flex items-center px-4 py-2 mt-1 text-sm rounded-md transition ${
      isActive
        ? "bg-gray-100 font-semibold text-gray-900"
        : "text-gray-700 hover:bg-gray-50"
    }`;

  return (
    <aside className="w-64 bg-white border-r h-screen overflow-y-auto">
      {/* LOGO */}
      <div className="px-4 py-5 border-b">
        <div className="text-xl font-bold">U1R</div>
        <div className="text-sm text-gray-500">Under One Roof</div>
      </div>

      {/* DASHBOARD */}
      <nav className="mt-4">
        <NavLink to="/admin/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        {/* ================= WHOLESALE ================= */}
        <div className={sectionClass}>Wholesale</div>

        <NavLink to="/admin/wholesale/users" className={linkClass}>
          Users
        </NavLink>

        <NavLink to="/admin/wholesale/categories" className={linkClass}>
          Categories
        </NavLink>

        <NavLink to="/admin/wholesale/subcategories" className={linkClass}>
          Subcategories
        </NavLink>

        <NavLink to="/admin/wholesale/products" className={linkClass}>
          Products
        </NavLink>

        <NavLink to="/admin/wholesale/weights" className={linkClass}>
          Weights
        </NavLink>

        <NavLink to="/admin/wholesale/positions" className={linkClass}>
          Positions
        </NavLink>

        <NavLink to="/admin/wholesale/orders" className={linkClass}>
          Orders
        </NavLink>

        <NavLink to="/admin/wholesale/request-product" className={linkClass}>
          Request Product
        </NavLink>

        <NavLink to="/admin/wholesale/notifications" className={linkClass}>
          Notifications
        </NavLink>

        <NavLink to="/admin/wholesale/home-layout" className={linkClass}>
          Home Layout
        </NavLink>

        <NavLink to="/admin/wholesale/slider" className={linkClass}>
          Slider
        </NavLink>

        <NavLink to="/admin/support" className={linkClass}>
          Support Tickets
        </NavLink>

        {/* ================= RETAIL ================= */}
        <div className={sectionClass}>Retail</div>

        <NavLink to="/admin/retail/users" className={linkClass}>
          Users
        </NavLink>

        <NavLink to="/admin/retail/categories" className={linkClass}>
          Categories
        </NavLink>

        <NavLink to="/admin/retail/subcategories" className={linkClass}>
          Subcategories
        </NavLink>

        <NavLink to="/admin/retail/products" className={linkClass}>
          Products
        </NavLink>

        <NavLink to="/admin/retail/positions" className={linkClass}>
          Positions
        </NavLink>

        <NavLink to="/admin/retail/orders" className={linkClass}>
          Orders
        </NavLink>

        <NavLink to="/admin/retail/request-product" className={linkClass}>
          Request Product
        </NavLink>

        <NavLink to="/admin/retail/notifications" className={linkClass}>
          Notifications
        </NavLink>

        <NavLink to="/admin/retail/home-layout" className={linkClass}>
          Home Layout
        </NavLink>

        <NavLink to="/admin/retail/slider" className={linkClass}>
          Slider
        </NavLink>

        <NavLink to="/admin/support" className={linkClass}>
          Support Tickets
        </NavLink>
      </nav>
    </aside>
  );
};

export default Sidebar;
