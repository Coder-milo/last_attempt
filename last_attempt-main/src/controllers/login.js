export function init() {

  document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    if (!form) return;
  
    const fields = {
      email: document.getElementById("email"),
      password: document.getElementById("password"),
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
  
    // Toggle ojo (si tu login tiene el botón .toggle-pass)
    const toggleBtn = document.querySelector(".password-field .toggle-pass");
    if (toggleBtn) {
      toggleBtn.addEventListener("click", () => {
        const input = toggleBtn.previousElementSibling;
        const icon = toggleBtn.querySelector("i");
        if (!input) return;
  
        if (input.type === "password") {
          input.type = "text";
          icon?.classList.remove("fa-eye");
          icon?.classList.add("fa-eye-slash");
        } else {
          input.type = "password";
          icon?.classList.remove("fa-eye-slash");
          icon?.classList.add("fa-eye");
        }
      });
    }
  
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
          "Credenciales inválidas";
        throw new Error(message);
      }
      return data;
    }
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearErrors();
  
      let ok = true;
  
      if (!isEmail(fields.email.value)) {
        setError(fields.email, "Ingresa un correo válido.");
        ok = false;
      }
      if (!fields.password.value) {
        setError(fields.password, "Ingresa tu contraseña.");
        ok = false;
      }
      if (!ok) return;
  
      // Loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const prevText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = "Iniciando...";
  
      try {
        // Ajusta endpoint a tu backend real
        const payload = {
          email: fields.email.value.trim(),
          password: fields.password.value,
        };
  
        const data = await postJSON(`${API_BASE}/auth/login`, payload);
  
        // Guarda token/usuario si tu backend lo devuelve
        if (data?.token) {
          localStorage.setItem("token", data.token);
        }
        if (data?.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
  
        // Redirige al dashboard/página principal
        window.location.href = "/app.html"; // cámbialo por tu ruta real
      } catch (err) {
        setError(fields.password, err.message || "Error al iniciar sesión.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = prevText;
      }
    });
  });
}
