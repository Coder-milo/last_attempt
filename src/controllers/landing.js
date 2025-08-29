// index.js
document.addEventListener("DOMContentLoaded", () => {

  // =====Scroll suave para el navbar ======
  const navLinks = document.querySelectorAll("header nav ul li a[href^='#']");
  navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href").substring(1);
      const targetSection = document.getElementById(targetId);
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 80, // ajustar offset por navbar
          behavior: "smooth"
        });
      }
    });
  });

  // == Botones Login / Reservar Cita ======
  const loginButtons = document.querySelectorAll(".btn-primary, .btn-secondary");
  loginButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const href = btn.getAttribute("href");
      if (href && href.includes("login.html")) {
        window.location.href = "login.html"; // redirige al login
      }
    });
  });

  // == FullCalendar básico (opcional) ======
  const calendarEl = document.getElementById("calendar"); // si tienes un div con id="calendar"
  if (calendarEl) {
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      locale: 'es',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
      },
      events: [] // aquí puedes cargar eventos desde tu backend
    });
    calendar.render();
  }

  //  Interacciones de precios (clic para login) ======
  const priceCards = document.querySelectorAll(".price-card");
  priceCards.forEach(card => {
    card.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  });

});
// Hamburger behaviour
// Hamburger behaviour
(function(){
  const btn = document.querySelector('.menu-toggle');
  const nav = document.getElementById('mainNav');
  if(!btn || !nav) return;

  const setOpen = (open) => {
    btn.setAttribute('aria-expanded', String(open));
    if(open){
      nav.hidden = false;
      requestAnimationFrame(() => nav.classList.add('open'));
    }else{
      nav.classList.remove('open');
      const onEnd = () => { nav.hidden = true; nav.removeEventListener('transitionend', onEnd); };
      nav.addEventListener('transitionend', onEnd);
    }
  };

  setOpen(false);
  btn.addEventListener('click', () => setOpen(btn.getAttribute('aria-expanded') !== 'true'));

  // Cerrar al hacer click en un enlace (solo móvil)
  nav.addEventListener('click', (e) => {
    if(e.target.closest('a') && window.innerWidth < 992){ setOpen(false); }
  });

  // Cerrar al hacer click fuera (solo móvil)
  document.addEventListener('click', (e) => {
    if(window.innerWidth >= 992) return;
    if(!e.target.closest('.navbar')) setOpen(false);
  });

  // Ajuste al cambiar tamaño
  window.addEventListener('resize', () => {
    if(window.innerWidth >= 992){
      nav.hidden = false; nav.classList.add('open'); btn.setAttribute('aria-expanded','false');
    }else{
      setOpen(false);
    }
  });

    
})();
