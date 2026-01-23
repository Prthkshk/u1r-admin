// Base API URL
// Prefer Vite env (local dev) and fall back to production host
const envBase =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  process.env?.VITE_API_BASE_URL;

export const API_BASE = envBase || "https://api.u1rfoods.com";

// Helper to prepend API base to relative paths
export const withBase = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
};
