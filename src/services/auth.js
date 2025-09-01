import { apiRequest } from "../api/request.js";

const ENDPOINTS = {
  profile: "/profile",
  logout: "/logout",
};

/**
 * Get logged-in user (via /profile)
 * Requires JWT cookie (HttpOnly)
 * 
 * @returns {Promise<object|null>} user object or null if not logged in
 */
export async function getLoggedUser() {
  try {
    const data = await apiRequest("GET", ENDPOINTS.profile);
    return data.user; 
  } catch (e) {
    if (e.status === 401 || e.status === 403) return null;
    throw e;
  }
}

/**
 * Logout user (via /logout)
 * Clears JWT cookie in backend
 * 
 * @returns {Promise<object>} { message: "logout successfully" }
 */
export async function logoutUser() {
  return apiRequest("POST", ENDPOINTS.logout, {});
}
