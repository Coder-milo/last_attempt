// ==== MAPAS (ajusta rutas a tu estructura) ====
// Vista por ruta
export const routes = {
  "/":          "/src/views/landing.html",
  "/landing":   "/src/views/landing.html",
  "/login":     "/src/views/login.html",
  "/register":  "/src/views/register.html",
  "/admin":     "/src/views/admin.html",
  "/barbero":   "/src/views/barbero.html",
  "/cliente":   "/src/views/cliente.html",
  "/404":       "/src/views/404.html",
};

// Controller por ruta (módulos ES)
export const controllers = {
  "/landing":   "./src/controllers/landing.js",
  "/login":     "/src/controllers/login.js",
  "/register":  "/src/controllers/register.js",
  "/admin":     "/src/controllers/admin.js",
  "/barbero":   "/src/controllers/barbero.js",
  "/cliente":   "/src/controllers/cliente.js",
  "/404":       "/src/controllers/404.js",
};

// Reglas de acceso por ruta
// Devuelve true si PERMITE entrar, false si no.
export const guards = {
  "/login":    (user) => !user,                        // solo invitados
  "/register": (user) => !user,                        // solo invitados
  "/admin":    (user) => user?.rol === "admi",
  "/barbero":  (user) => user?.rol === "barbero",
  "/cliente":  (user) => user?.rol === "cliente",
};

// ====== Router ======
const app = document.getElementById("app");

// De dónde sacamos el "user"
function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem("user")); }
  catch { return null; }
}

// Dónde redirigir si un guard bloquea
function deniedRedirect(user) {
  return user ? "/landing" : "/login"; // personaliza si quieres
}

// Extrae contenido útil de una vista (si tiene #view lo usa; si no, body entero)
function pickView(htmlText) {
  const doc = new DOMParser().parseFromString(htmlText, "text/html");
  const view = doc.querySelector("#view");
  return view ? view.innerHTML : doc.body.innerHTML;
}

// Carga e inyecta la vista
async function loadView(path) {
  const viewUrl = routes[path] || routes["/404"];
  const res = await fetch(viewUrl, { cache: "no-cache" });
  if (!res.ok) throw new Error(HTTP ${res.status} cargando ${viewUrl});
  app.innerHTML = pickView(await res.text());
}

// Importa y ejecuta el controller si existe
async function runController(path) {
  const modPath = controllers[path];
  if (!modPath) return;
  const mod = await import(modPath);
  if (typeof mod?.default === "function") {
    await mod.default();            // si exportas una función
  } else if (typeof mod?.default?.init === "function") {
    await mod.default.init();       // si exportas { init(){} }
  }
}

// Maneja la navegación
async function handleRoute() {
  let path = window.location.pathname || "/";
  if (!routes[path]) path = "/404";

  // Guard
  const guard = guards[path];
  if (guard) {
    const user = getCurrentUser();
    const allowed = !!guard(user);
    if (!allowed) {
      const to = deniedRedirect(user);
      if (to !== path) return navigateTo(to);
      // para evitar bucles, si deniedRedirect devuelve la misma, seguimos
    }
  }

  // Render + controller
  try {
    await loadView(path);
    await runController(path);
  } catch (err) {
    console.error(err);
    app.innerHTML = <pre style="padding:1rem;color:#b00">${err.message}</pre>;
  }
}

// Navegación programática
export function navigateTo(url) {
  if (window.location.pathname === url) return;
  history.pushState(null, "", url);
  handleRoute();
}

// Inicializa router
export function initRouter() {
  // Intercepta <a data-link>
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[data-link]");
    if (a && a.getAttribute("href")) {
      e.preventDefault();
      const to = new URL(a.href).pathname;
      navigateTo(to);
    }
  });

  window.addEventListener("popstate", handleRoute);
  handleRoute();
}