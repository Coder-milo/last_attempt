// ====== Cambio de pestañas ======
const tabBtns = document.querySelectorAll(".tab-btn");
const tabContents = document.querySelectorAll(".tab-content");

tabBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    // Quitar clases activas
    tabBtns.forEach(b => b.classList.remove("active"));
    tabContents.forEach(c => c.classList.remove("active"));

    // Activar el tab clickeado
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// ====== Gestión de Usuarios (Barberos) ======
const formUsuario = document.getElementById("formUsuario");
const listaUsuarios = document.getElementById("listaUsuarios");

formUsuario.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombreUsuario").value;
  const usuario = document.getElementById("userUsuario").value;
  const pass = document.getElementById("passUsuario").value;

  const li = document.createElement("li");
  li.innerHTML = `
    <strong>${nombre}</strong> (${usuario})
    <button class="delete-btn">❌</button>
  `;

  // Eliminar usuario
  li.querySelector(".delete-btn").addEventListener("click", () => {
    li.remove();
  });

  listaUsuarios.appendChild(li);
  formUsuario.reset();
});

// ====== Gestión de Servicios ======
const formServicio = document.getElementById("formServicio");
const listaServicios = document.getElementById("listaServicios");

formServicio.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombreServicio").value;
  const precio = document.getElementById("precioServicio").value;
  const duracion = document.getElementById("duracionServicio").value;
  const promo = document.getElementById("promoServicio").value || "Sin promoción";

  const li = document.createElement("li");
  li.innerHTML = `
    💈 <strong>${nombre}</strong> - $${precio} - ⏱️ ${duracion} - 🎉 ${promo}
    <button class="delete-btn">❌</button>
  `;

  // Eliminar servicio
  li.querySelector(".delete-btn").addEventListener("click", () => {
    li.remove();
  });

  listaServicios.appendChild(li);
  formServicio.reset();
});

// ====== Gestión de Citas ======
const listaCitas = document.getElementById("listaCitas");

if (listaCitas) {
  listaCitas.querySelectorAll("li").forEach(li => {
    const aprobarBtn = li.querySelector("button:nth-child(2)");
    const cancelarBtn = li.querySelector("button:nth-child(3)");

    aprobarBtn.addEventListener("click", () => {
      li.style.color = "green";
      aprobarBtn.disabled = true;
      cancelarBtn.disabled = true;
    });

    cancelarBtn.addEventListener("click", () => {
      li.style.color = "red";
      aprobarBtn.disabled = true;
      cancelarBtn.disabled = true;
    });
  });
}

// ====== Reportes ======
// Esto normalmente vendría de la base de datos.
// Aquí ponemos algo dinámico simulado.
function actualizarReportes() {
  const reportCard = document.querySelector(".report-card");
  if (!reportCard) return;

  const ingresos = Math.floor(Math.random() * 5000000) + 1000000;
  const clientes = Math.floor(Math.random() * 200) + 50;
  const citas = Math.floor(Math.random() * 300) + 100;

  reportCard.innerHTML = `
    <p>Ingresos del mes: <strong>$${ingresos.toLocaleString()}</strong></p>
    <p>Número de clientes: <strong>${clientes}</strong></p>
    <p>Citas realizadas: <strong>${citas}</strong></p>
  `;
}

// Refrescar reportes cada 10 segundos (demo)
setInterval(actualizarReportes, 10000);
