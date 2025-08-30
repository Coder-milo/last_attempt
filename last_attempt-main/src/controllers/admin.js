export function init() {
  // ====== Tabs ======
  const tabs = document.querySelectorAll(".tab-btn");
  const contents = document.querySelectorAll(".tab-content");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");

      contents.forEach(c => c.classList.remove("active"));
      document.getElementById(tab.dataset.tab).classList.add("active");
    });
  });

  // ====== Users Form ======
  const formUsuario = document.getElementById("formUsuario");
  const listaUsuarios = document.getElementById("listaUsuarios");

  formUsuario.addEventListener("submit", e => {
    e.preventDefault();
    const nombre = document.getElementById("nombreUsuario").value;
    const user = document.getElementById("userUsuario").value;

    const li = document.createElement("li");
    li.textContent = `${nombre} (${user})`;
    listaUsuarios.appendChild(li);

    formUsuario.reset();
  });

  // ====== Services Form ======
  const formServicio = document.getElementById("formServicio");
  const listaServicios = document.getElementById("listaServicios");

  formServicio.addEventListener("submit", e => {
    e.preventDefault();
    const nombre = document.getElementById("nombreServicio").value;
    const precio = document.getElementById("precioServicio").value;

    const li = document.createElement("li");
    li.textContent = `${nombre} - $${precio}`;
    listaServicios.appendChild(li);

    formServicio.reset();
  });

  // ====== Appointments Buttons ======
  const listaCitas = document.getElementById("listaCitas");

  listaCitas.addEventListener("click", e => {
    const li = e.target.closest("li");
    if (!li) return;

    if (e.target.classList.contains("btn-success")) {
      li.style.backgroundColor = "#d4edda"; // verde
    }
    if (e.target.classList.contains("btn-danger")) {
      li.style.backgroundColor = "#f8d7da"; // rojo
    }
  });
}
