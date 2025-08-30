// app/controllers/register.js
import { apiRequest } from "../api/request.js";
import { isEmail, isValidName, validatePassword, acceptedTerms, validateInputs } from "../services/validations.js";

export function init() {
  const form = document.getElementById("registerForm");
  if (!form) return;

  const fields = {
    name:     document.getElementById("name"),
    email:    document.getElementById("email"),
    password: document.getElementById("password"),
    terms:    document.getElementById("terms"),
  };

  const setError = (input, msg) => {
    if (!input) return;
    const small = input.closest(".field")?.querySelector(".error");
    if (small) small.textContent = msg || "";
    input.classList.toggle("has-error", !!msg);
  };

  const clearErrors = () => {
    form.querySelectorAll(".error").forEach((s) => (s.textContent = ""));
    form.querySelectorAll(".has-error").forEach((el) => el.classList.remove("has-error"));
    const termsErr = document.getElementById("termsError");
    if (termsErr) termsErr.textContent = "";
  };

  // Mostrar/ocultar contraseña
  form.querySelectorAll(".toggle-pass").forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.previousElementSibling;
      const icon = btn.querySelector("i");
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
      if (icon) {
        icon.classList.toggle("fa-eye");
        icon.classList.toggle("fa-eye-slash");
      }
    });
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    const name     = fields.name?.value ?? "";
    const email    = fields.email?.value ?? "";
    const password = fields.password?.value ?? "";
    const termsOk  = !!fields.terms?.checked;

    // === Validaciones usando TUS funciones ===
    let ok = true;

    if (!validateInputs(name)) {
      setError(fields.name, "Ingresa tu nombre.");
      ok = false;
    } else if (!isValidName(name)) {
      setError(fields.name, "Nombre inválido.");
      ok = false;
    }

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
      setError(fields.password, "Min 6 caracteres, mayúscula, minúscula y carácter especial.");
      ok = false;
    }

    if (!acceptedTerms(termsOk)) {
      const termsErr = document.getElementById("termsError");
      if (termsErr) termsErr.textContent = "Debes aceptar los términos.";
      ok = false;
    }

    if (!ok) return;

    // === Envío a la API (usa tu apiRequest con cookies si ya lo configuraste) ===
    const submitBtn = form.querySelector('button[type="submit"]');
    const prevText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Creando cuenta...";

    try {
      const payload = {
        username: name.trim(),   // el backend pide 'username'
        email: email.trim(),
        password,
        code_name: 'CLIENT_03'
      };

      await apiRequest('POST', '/register', payload);

      // Redirige al login (o usa tu router si prefieres)
      window.location.href = "/login";
      // o: import { navegation } from "../router.js"; navegation("/login");
    } catch (err) {
      setError(fields.email, err.message || "No se pudo crear la cuenta.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = prevText;
    }
  });
}
