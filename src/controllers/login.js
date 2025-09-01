// app/controllers/login.js
import { apiRequest } from "../api/request.js";
import { getLoggedUser } from "../services/auth.js";
import { isEmail, validatePassword, validateInputs } from "../services/validations.js";

export function init() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  const fields = {
    email: document.getElementById("email"),
    password: document.getElementById("password"),
  };

  const setError = (input, msg) => {
    if (!input) return;
    const small = input.closest(".field")?.querySelector(".error");
    if (small) small.textContent = msg || "";
    input.classList.toggle("has-error", !!msg);
  };

  const clearErrors = () => {
    form.querySelectorAll(".error").forEach(el => (el.textContent = ""));
    form.querySelectorAll(".has-error").forEach(el => el.classList.remove("has-error"));
  };

  function routeForUser(user) {
    const code = user?.code_name;
    const role = user?.role || user?.rol;
    if (code === 'ADMIN_01'  || role === 'admin')  return '/admin';
    if (code === 'BARBER_02' || role === 'barber') return '/barbers';
    return '/client'; // CLIENT_03 u otros
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    const email = fields.email?.value ?? "";
    const password = fields.password?.value ?? "";

    let ok = true;
    if (!validateInputs(email)) {
      setError(fields.email, "Ingresa tu correo.");
      ok = false;
    } else if (!isEmail(email)) {
      setError(fields.email, "Correo no válido.");
      ok = false;
    }
    if (!validateInputs(password)) {
      setError(fields.password, "Ingresa tu contraseña.");
      ok = false;
    } else if (!validatePassword(password)) {
      setError(fields.password, "Mín. 6 caracteres, mayús., minús. y carácter especial.");
      ok = false;
    }
    if (!ok) return;

    const btn = form.querySelector('button[type="submit"]');
    const prev = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Iniciando...";

    try {
      // 1) Login: el backend setea cookie HttpOnly
      await apiRequest("POST", "/login", { email: email.trim(), password });

      // 2) Pide el perfil usando la cookie (credentials: 'include' ya va en apiRequest)
      const user = await getLoggedUser();

      if (!user) {
        // La cookie no llegó/guardó. Muestra error claro.
        setError(fields.password, "Sesión no establecida. Verifica CORS y cookies (Secure/ SameSite=None).");
        return;
      }

      // 3) Redirige según rol/código
      const target = routeForUser(user);
      window.location.href = target; // o usa tu SPA: import { navigation } y navigation(target)
    } catch (err) {
      setError(fields.password, err.message || "Credenciales inválidas.");
    } finally {
      btn.disabled = false;
      btn.textContent = prev;
    }
  });
}
