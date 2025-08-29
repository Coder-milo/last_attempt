// ====== Reservar Cita ======
const formCita = document.getElementById("formCita");
const listaMisCitas = document.getElementById("listaMisCitas");

if (formCita) {
  formCita.addEventListener("submit", (e) => {
    e.preventDefault();

    const servicio = document.getElementById("servicioCita").value;
    const fecha = document.getElementById("fechaCita").value;
    const hora = document.getElementById("horaCita").value;

    const li = document.createElement("li");
    li.innerHTML = `
      📅 <strong>${servicio}</strong> - ${fecha} ${hora}
      <span class="estado">Pendiente</span>
      <button class="cancel-btn">Cancelar</button>
    `;

    // Cancelar cita
    li.querySelector(".cancel-btn").addEventListener("click", () => {
      li.querySelector(".estado").textContent = "Cancelada";
      li.querySelector(".estado").style.color = "red";
    });

    listaMisCitas.appendChild(li);
    formCita.reset();
  });
}

// ====== Ver Promociones ======
function cargarPromociones() {
  const promoBox = document.getElementById("promoBox");
  if (!promoBox) return;

  const promociones = [
    "2x1 en cortes los lunes 💇",
    "50% descuento en tinturas 🎨",
    "Barba gratis al cortar el cabello 🧔",
  ];

  promoBox.innerHTML = promociones
    .map(promo => `<li>🎉 ${promo}</li>`)
    .join("");
}

cargarPromociones();
