// app/controllers/login.js
import { apiRequest } from "../api/request.js";
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

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    const email = fields.email?.value ?? "";
    const password = fields.password?.value ?? "";

    // === Validaciones (usando TUS funciones) ===
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

    // === Envío a la API (cookie en back; el helper ya puede llevar credentials: 'include') ===
    const btn = form.querySelector('button[type="submit"]');
    const prev = btn.textContent;
    btn.disabled = true;
    btn.textContent = "Iniciando...";

    try {
      await apiRequest("POST", "/login", { email: email.trim(), password });

      // Redirige (ajusta a tu router si prefieres navegación SPA)
      window.location.href = "/client";
      // o: import { navegation } from "../router.js"; navegation("/dashboard");
    } catch (err) {
      setError(fields.password, err.message || "Credenciales inválidas.");
    } finally {
      btn.disabled = false;
      btn.textContent = prev;
    }
  });
}
