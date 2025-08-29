// js/utils.js

// Cambia la URL según donde tengas corriendo tu backend
const API_URL = "http://localhost:3000";

// Obtener token
function getToken() {
  return localStorage.getItem("token");
}

// Obtener usuario
function getUser() {
  return JSON.parse(localStorage.getItem("user"));
}

// Cerrar sesión
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "index.html";
}
