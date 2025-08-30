export function init() {

}

// Simulación de datos
let agenda = [
{ hora: "10:00 AM", cliente: "Juan Pérez" },
{ hora: "11:00 AM", cliente: "Pedro Gómez" },
{ hora: "2:00 PM", cliente: "Andrés Díaz" }
];

let clientes = [
{ nombre: "Juan Pérez", historial: "Corte clásico - 2 veces" },
{ nombre: "Pedro Gómez", historial: "Corte + Barba" },
{ nombre: "Andrés Díaz", historial: "Fade - 3 veces" }
];

let disponibilidad = [];

// Mostrar agenda
function cargarAgenda() {
let lista = document.getElementById("agenda");
lista.innerHTML = "";
agenda.forEach((cita, index) => {
  let li = document.createElement("li");
  li.innerHTML = `${cita.hora} - ${cita.cliente} <button onclick="marcarRealizada(${index})">Realizada</button>`;
  lista.appendChild(li);
});
}

// Marcar cita como realizada
function marcarRealizada(index) {
let realizada = agenda[index];
alert(`Cita con ${realizada.cliente} marcada como realizada ✅`);
agenda.splice(index, 1);
cargarAgenda();
}

// Agregar disponibilidad
function agregarDisponibilidad() {
let horario = document.getElementById("horario").value;
if (horario.trim() !== "") {
  disponibilidad.push(horario);
  mostrarDisponibilidad();
  document.getElementById("horario").value = "";
}
}

function mostrarDisponibilidad() {
let lista = document.getElementById("disponibilidad");
lista.innerHTML = "";
disponibilidad.forEach(h => {
  let li = document.createElement("li");
  li.textContent = h;
  lista.appendChild(li);
});
}// ====== Ver Citas Asignadas ======
const listaCitasBarbero = document.getElementById("listaCitasBarbero");

if (listaCitasBarbero) {
listaCitasBarbero.querySelectorAll("li").forEach(li => {
  const iniciarBtn = li.querySelector(".iniciar-btn");
  const terminarBtn = li.querySelector(".terminar-btn");

  iniciarBtn.addEventListener("click", () => {
    li.querySelector(".estado").textContent = "En progreso";
    li.querySelector(".estado").style.color = "blue";
    iniciarBtn.disabled = true;
  });

  terminarBtn.addEventListener("click", () => {
    li.querySelector(".estado").textContent = "Finalizada ✅";
    li.querySelector(".estado").style.color = "green";
    terminarBtn.disabled = true;
  });
});
}

// ====== Disponibilidad del Barbero ======
const disponibilidadToggle = document.getElementById("disponibilidadToggle");

if (disponibilidadToggle) {
disponibilidadToggle.addEventListener("change", () => {
  const label = document.getElementById("disponibilidadLabel");
  if (disponibilidadToggle.checked) {
    label.textContent = "Disponible 🟢";
    label.style.color = "green";
  } else {
    label.textContent = "No disponible 🔴";
    label.style.color = "red";
  }
});
}


// Ver clientes
function verClientes() {
let lista = document.getElementById("clientes");
lista.innerHTML = "";
clientes.forEach(c => {
  let li = document.createElement("li");
  li.innerHTML = `<b>${c.nombre}</b> - ${c.historial}`;
  lista.appendChild(li);
});
}

