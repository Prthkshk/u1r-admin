import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout
import AdminLayout from "./layout/AdminLayout";

// Pages
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import ViewProducts from "./pages/ViewProducts";
import EditProduct from "./pages/EditProduct";
import AddProduct from "./pages/AddProduct";
import Positions from "./pages/Positions";
import EditCategory from "./pages/EditCategory";
import Subcategories from "./pages/Subcategories";
import EditSubcategory from "./pages/EditSubcategory";
import SliderPage from "./pages/SliderPage";
import Notifications from "./pages/Notifications";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import RequestProduct from "./pages/RequestProduct";
import Users from "./pages/Users";
import HomeLayout from "./pages/HomeLayout";
import Support from "./pages/Support";
import AdminProtectedRoute from "./components/AdminProtectedRoute";



// import Users from "./pages/Users";
// import RequestProduct from "./pages/RequestProduct";
// import Support from "./pages/Support";


function App() {
  const ProtectedLayout = ({ children }) => (
    <AdminProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </AdminProtectedRoute>
  );

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN PAGE (NO SIDEBAR) */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* ==== ADMIN PAGES (ALL INSIDE ADMIN LAYOUT) ==== */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />

        <Route
          path="/admin/categories"
          element={
            <ProtectedLayout>
              <Categories />
            </ProtectedLayout>
          }
        />

        <Route
          path="/admin/products"
          element={
            <ProtectedLayout>
              <Products />
            </ProtectedLayout>
          }
        />

        <Route
          path="/admin/view-products"
          element={
            <ProtectedLayout>
              <ViewProducts />
            </ProtectedLayout>
          }
        />

        {/* DEFAULT ADMIN REDIRECT */}
        <Route
          path="/admin"
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          }
        />

        <Route
          path="/admin/edit-product/:id"
          element={
            <ProtectedLayout>
              <EditProduct/>
            </ProtectedLayout>
          }
        />

        <Route
          path="/admin/add-product"
          element={
            <ProtectedLayout>
              <AddProduct />
            </ProtectedLayout>
          }
        />

        <Route
          path="/admin/edit-category/:id"
          element={
            <ProtectedLayout>
              <EditCategory />
            </ProtectedLayout>
          }
        />

        <Route
          path="/admin/subcategories"
          element={
            <ProtectedLayout>
              <Subcategories />
            </ProtectedLayout>
          }
        />

        <Route
          path="/admin/edit-subcategory/:id"
          element={
            <ProtectedLayout>
              <EditSubcategory />
            </ProtectedLayout>
          }
        />

        <Route
          path="/admin/slider"
          element={
            <ProtectedLayout>
              <SliderPage />
            </ProtectedLayout>
          }
        />

        <Route
          path="/admin/notifications"
          element={
            <ProtectedLayout>
              <Notifications />
            </ProtectedLayout>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <ProtectedLayout>
              <Orders />
            </ProtectedLayout>
          }
        />

        <Route
          path="/admin/order/:id"
          element={
            <ProtectedLayout>
              <OrderDetails />
            </ProtectedLayout>
          }
        />

        <Route
          path="/admin/request-product"
          element={
            <ProtectedLayout>
              <RequestProduct />
            </ProtectedLayout>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedLayout>
              <Users />
            </ProtectedLayout>
          }
        />

        <Route
          path="/admin/home-layout"
          element={
            <ProtectedLayout>
              <HomeLayout />
            </ProtectedLayout>
          }
        />

        <Route
          path="/admin/support"
          element={
            <ProtectedLayout>
              <Support />
            </ProtectedLayout>
          }
        />

        {/* ==== WHOLESALE ROUTES (SIDEBAR LINKS) ==== */}
        <Route
          path="/admin/wholesale/users"
          element={
            <ProtectedLayout>
              <Users />
            </ProtectedLayout>
          }
        />
        <Route
          path="/admin/wholesale/categories"
          element={
            <ProtectedLayout>
              <Categories />
            </ProtectedLayout>
          }
        />
        <Route
          path="/admin/wholesale/subcategories"
          element={
            <ProtectedLayout>
              <Subcategories />
            </ProtectedLayout>
          }
        />
        <Route
          path="/admin/wholesale/view-products"
          element={
            <ProtectedLayout>
              <ViewProducts />
            </ProtectedLayout>
          }
        />
        <Route
          path="/admin/wholesale/add-product"
          element={
            <ProtectedLayout>
              <AddProduct />
            </ProtectedLayout>
          }
        />
        <Route
          path="/admin/wholesale/positions"
          element={
            <ProtectedLayout>
              <Positions />
            </ProtectedLayout>
          }
        />
        <Route
          path="/admin/wholesale/orders"
          element={
            <ProtectedLayout>
              <Orders />
            </ProtectedLayout>
          }
        />
        <Route
          path="/admin/wholesale/request-product"
          element={
            <ProtectedLayout>
              <RequestProduct />
            </ProtectedLayout>
          }
        />
        <Route
          path="/admin/wholesale/notifications"
          element={
            <ProtectedLayout>
              <Notifications />
            </ProtectedLayout>
          }
        />
        <Route
          path="/admin/wholesale/home-layout"
          element={
            <ProtectedLayout>
              <HomeLayout />
            </ProtectedLayout>
          }
        />
        <Route
          path="/admin/wholesale/support"
          element={
            <ProtectedLayout>
              <Support />
            </ProtectedLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
