// register.js
// ---------------------------------------------------
// Front: validación básica + toggle password + POST a API
// Cambia API_BASE si tu backend corre en otra URL/puerto
const API_BASE = "/api"; // ej: "http://localhost:3000/api"

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  if (!form) return;

  const fields = {
    name: document.getElementById("name"),
    email: document.getElementById("email"),
    password: document.getElementById("password"),
    confirm: document.getElementById("confirm"),
    terms: document.getElementById("terms"),
  };

  // Helpers
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v).trim());

  const setError = (input, msg) => {
    const small = input.closest(".field")?.querySelector(".error");
    if (small) small.textContent = msg || "";
    input.classList.toggle("has-error", !!msg);
  };

  const clearErrors = () => {
    document.querySelectorAll(".error").forEach((s) => (s.textContent = ""));
    document.querySelectorAll(".has-error").forEach((el) =>
      el.classList.remove("has-error")
    );
  };

  const toggleButtons = document.querySelectorAll(".toggle-pass");
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const input = btn.previousElementSibling; // el <input> antes del botón
      const icon = btn.querySelector("i");
      if (!input) return;

      if (input.type === "password") {
        input.type = "text";
        if (icon) {
          icon.classList.remove("fa-eye");
          icon.classList.add("fa-eye-slash");
        }
      } else {
        input.type = "password";
        if (icon) {
          icon.classList.remove("fa-eye-slash");
          icon.classList.add("fa-eye");
        }
      }
    });
  });

  // POST helper
  async function postJSON(url, body) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message =
        data?.message ||
        data?.error ||
        (Array.isArray(data?.errors) && data.errors[0]?.msg) ||
        "Error en la solicitud";
      throw new Error(message);
    }
    return data;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    let ok = true;

    if (!fields.name.value.trim()) {
      setError(fields.name, "Ingresa tu nombre.");
      ok = false;
    }

    if (!isEmail(fields.email.value)) {
      setError(fields.email, "Ingresa un correo válido.");
      ok = false;
    }

    if (fields.password.value.length < 6) {
      setError(fields.password, "Mínimo 6 caracteres.");
      ok = false;
    }

    if (fields.confirm.value !== fields.password.value) {
      setError(fields.confirm, "Las contraseñas no coinciden.");
      ok = false;
    }

    if (!fields.terms.checked) {
      const termsErr = document.getElementById("termsError");
      if (termsErr) termsErr.textContent = "Debes aceptar los términos.";
      ok = false;
    }

    if (!ok) return;

    // Loading state (simple)
    const submitBtn = form.querySelector('button[type="submit"]');
    const prevText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Creando cuenta...";

    try {
      // Ajusta el endpoint a tu backend real
      const payload = {
        name: fields.name.value.trim(),
        email: fields.email.value.trim(),
        password: fields.password.value,
      };

      const data = await postJSON(`${API_BASE}/auth/register`, payload);

      // Si tu backend devuelve token:
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      // Si devuelve usuario:
      if (data?.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Redirige a login o dashboard
      // window.location.href = "/app.html";
      window.location.href = "login.html";
    } catch (err) {
      // Muestra error arriba del formulario o cercano a email
      setError(fields.email, err.message || "No se pudo crear la cuenta.");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = prevText;
    }
  });
});
