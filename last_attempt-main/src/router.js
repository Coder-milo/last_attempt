// router.js
// ✅ Si usas guards otra vez, los reactivas; por ahora van fuera.
const routes = {
  '/'         : '/src/views/landing.html',
  '/login'    : '/src/views/login.html',
  '/register' : '/src/views/register.html',
  '/client'   : '/src/views/client.html',
  '/barbers'  : '/src/views/barbers.html',
  '/admin'    : '/src/views/admin.html'
};

const controllers = {
  '/'         : '/src/controllers/landing.js',
  '/login'    : '/src/controllers/login.js',
  '/register' : '/src/controllers/register.js',
  '/client'   : '/src/controllers/client.js',
  '/barbers'  : '/src/controllers/barbers.js',
  '/admin'    : '/src/controllers/admin.js',
  '/404'      : '/src/controllers/404.js',
};

const app = document.getElementById('app');

// Normaliza el path (quita query/hash y asegura clave del mapa)
function normalizePath(pathname) {
  try {
    const url = new URL(pathname, location.origin);
    const p = url.pathname.replace(/\/+$/, '') || '/'; // quita / final
    return routes[p] ? p : '/404';
  } catch {
    return '/404';
  }
}

export async function loadView(path) {
  const normalized = normalizePath(path);
  const viewUrl = routes[normalized] || routes['/404'];

  try {
    const res = await fetch(viewUrl, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    app.innerHTML = await res.text();

    const ctlrPath = controllers[normalized];
    if (ctlrPath) {
      // ✅ Con Vite usa import absoluto/relativo válido
      const module = await import(/* @vite-ignore */ ctlrPath);
      if (module?.init) module.init();
    }
  } catch (err) {
    console.error('loadView error:', err);
    app.innerHTML = `<h1>Unexpected error while loading the view.</h1>`;
  }
}

export function navigation(path) {
  const normalized = normalizePath(path);
  if (normalized !== location.pathname) {
    history.pushState(null, '', normalized);
  }
  loadView(normalized);
}

// Navegación por botones del navegador
window.addEventListener('popstate', () => {
  loadView(location.pathname);
});

// Intercepta clics en <a data-link> y también <a> internos
export function navigationTag() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a');
    if (!a) return;

    const href = a.getAttribute('href') || a.getAttribute('data-link');
    if (!href) return;

    // Solo intercepta enlaces internos (mismo origen) y que no tengan target _blank
    const isInternal = href.startsWith('/') && !a.target;
    const hasDataLink = a.hasAttribute('data-link');
    if (!isInternal && !hasDataLink) return;

    e.preventDefault();
    navigation(href);
  });
}
