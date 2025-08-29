// src/main.js
import { initRouter, navigateTo } from "./router.js";

initRouter();

// Redirección inicial opcional
if (location.pathname === "/") {
  navigateTo("/landing");
}