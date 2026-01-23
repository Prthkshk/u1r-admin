import { Navigate } from "react-router-dom";
import { isJwtExpired } from "../utils/jwt";

export default function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem("adminToken");

  if (!token) return <Navigate to="/admin/login" />;

  if (isJwtExpired(token)) {
    localStorage.removeItem("adminToken");
    return <Navigate to="/admin/login" />;
  }

  return children;
}
