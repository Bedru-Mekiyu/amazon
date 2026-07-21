import axios from "axios";

// The base URL for API requests.
// In development, Vite proxies /api to localhost:3000 so this is empty.
// In production on Vercel, set VITE_API_URL to the Render backend URL.
const API_BASE = import.meta.env.VITE_API_URL || "";

/**
 * Preconfigured axios instance.
 * - baseURL is set from VITE_API_URL (empty = same origin, works with Vite proxy)
 * - No trailing slash on API_BASE — routes should start with /api/...
 */
const api = axios.create({
  baseURL: API_BASE,
});

/**
 * Build an absolute URL for assets served by the backend.
 * Works for both images and any other static backend path.
 *
 * @param {string} path - Relative path (e.g. "images/products/foo.jpg")
 * @returns {string} Full URL when deployed, same-origin path otherwise
 */
export function assetUrl(path) {
  if (!API_BASE) return path;
  const separator = path.startsWith("/") ? "" : "/";
  return `${API_BASE}${separator}${path}`;
}

export default api;
