// Base API URL
// Prefer Vite env (local dev) and fall back to production host
const envBase =
  (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_BASE_URL) ||
  process.env?.VITE_API_BASE_URL;

export const API_BASE = envBase || "https://api.u1rfoods.com";

// Helper to prepend API base to relative paths
export const withBase = (path) => {
  if (!path) return "";
  const cleaned = String(path).trim().replace(/\\/g, "/");
  if (!cleaned) return "";
  if (/^https?:\/\//i.test(cleaned)) {
    try {
      const parsed = new URL(cleaned);
      if (parsed.pathname?.startsWith("/uploads/")) {
        return `${API_BASE}${parsed.pathname}${parsed.search || ""}`;
      }
      return cleaned;
    } catch {
      return cleaned;
    }
  }
  const normalized = cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
  return `${API_BASE}${normalized}`;
};
