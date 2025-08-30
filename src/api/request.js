const apiUrl = 'http://localhost:3000';

export async function apiRequest(method, endpoint = '', body = null, opts = {}) {
  try {
    const isFormData = body instanceof FormData;

    const headers = {};
    if (!isFormData) headers['Content-Type'] = 'application/json';

    const options = {
      method,
      credentials: 'include', 
      headers,
      ...opts,
    };

    if (body && method !== 'GET') {
      options.body = isFormData ? body : JSON.stringify(body);
    }

    const res = await fetch(`${apiUrl}${endpoint}`, options);

    // Si el server devuelve JSON con error, intenta leerlo
    if (!res.ok) {
      let detail = '';
      try {
        const errJson = await res.json();
        detail = errJson.message || errJson.error || '';
      } catch { /* ignore */ }
      const error = new Error(detail || res.statusText || 'Request failed');
      error.status = res.status;
      throw error;
    }

    // 204 No Content o respuestas vacías
    if (res.status === 204) return null;

    // Intenta parsear JSON (si falla, devuelve texto)
    const text = await res.text();
    try {
      return text ? JSON.parse(text) : null;
    } catch {
      return text;
    }

  } catch (error) {
    const message = error.message || "An error has occurred";
    console.log(`Error ${error.status || ''} ${message}`, 'error');
    throw error;
  }
}
