/* ===== CHATBOT AMIGABLE AVANZADO ===== */

// --- Elementos ---
const chatbotToggle = document.querySelector('.chatbot-toggle');
const chatbotBox = document.querySelector('.chatbot-box');
const chatbotClose = document.querySelector('.chatbot-close');
const chatbotInput = document.querySelector('.chatbot-input');
const chatbotSend = document.querySelector('.chatbot-send');
const messagesEl = document.querySelector('.chatbot-messages');
const optionsEl = document.querySelector('.chatbot-options');
const voiceBtn = document.querySelector('.chatbot-voice');

// --- NAVBAR (menú hamburguesa) ---
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('#mainNav');

// toggle menú hamburguesa
if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", !expanded);
    mainNav.hidden = expanded;
  });
}

let waitingForFaceType = false;
let awaitingBooking = false;
let recognition; // speech recognition instance (if supported)

// --- Quick options ---
const quickOptions = [
  { text: "Recomendación de corte", value: "corte" },
  { text: "Ver precios", value: "precios" },
  { text: "Horarios", value: "horarios" },
  { text: "Ubicación", value: "ubicacion" },
  { text: "Tips de cuidado", value: "tips" },
  { text: "Agendar cita", value: "cita" }
];

// --- Example images for haircuts ---
const haircutImages = {
  pompadour: ["/assets/img/cortes/pompadour1.jpg","/assets/img/cortes/pompadour2.jpg"],
  fade: ["/assets/img/cortes/fade1.jpg","/assets/img/cortes/fade2.jpg"],
  quiff: ["/assets/img/cortes/quiff1.jpg"],
  buzz: ["/assets/img/cortes/buzz1.jpg"]
};

// --- Utilities: persist chat history ---
const CHAT_KEY = "barbexa_chat_history_v1";
function saveMessageToHistory(obj){
  try{
    const history = JSON.parse(localStorage.getItem(CHAT_KEY) || "[]");
    history.push({ ...obj, t: Date.now() });
    localStorage.setItem(CHAT_KEY, JSON.stringify(history.slice(-200)));
  }catch(e){}
}
function loadHistory(){
  try{
    const history = JSON.parse(localStorage.getItem(CHAT_KEY) || "[]");
    history.forEach(msg => appendMessage(msg.text, msg.sender, false));
    if(history.length===0){
      appendMessage("👋 Hola, soy tu asistente ALEX. ¿En qué puedo ayudarte hoy?", "bot");
      showOptions();
    } else {
      setTimeout(() => showOptions(), 400);
    }
  }catch(e){
    appendMessage("👋 Hola, soy ALEX. ¿En qué puedo ayudarte hoy?", "bot");
    showOptions();
  }
}

// --- Append message ---
function appendMessage(text, sender="bot", save=true){
  const el = document.createElement("div");
  el.className = `message ${sender === "user" ? "user" : "bot"}`;
  if(typeof text === "string") el.innerHTML = text;
  else el.appendChild(text);
  messagesEl.appendChild(el);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  if(save) saveMessageToHistory({ text: (typeof text === "string"? text : el.innerText), sender });
}

// --- Show quick options ---
function showOptions(){
  optionsEl.innerHTML = "";
  quickOptions.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "chatbot-option";
    btn.textContent = opt.text;
    btn.addEventListener("click", () => handleOption(opt.value));
    optionsEl.appendChild(btn);
  });
  optionsEl.removeAttribute("hidden");
}

// --- Option handler ---
function handleOption(value){
  appendMessage(getLabelByValue(value), "user");
  optionsEl.setAttribute("hidden", "");

  if(value === "corte"){
    appendMessage("¡Genial! 😊 Cuéntame, ¿cómo describirías tu rostro? (redondo, cuadrado, alargado, ovalado)", "bot");
    waitingForFaceType = true;
  } 
  else if(value === "tips"){
    appendMessage(getCareTips(), "bot");
    setTimeout(showOptions,700);
  } 
  else if(value === "cita"){
    appendMessage("Perfecto 👍 te llevaré al login para que agendes tu cita.", "bot");
    setTimeout(()=> window.location.href="/views/login.html",1500);
  }
  else {
    appendMessage(getBotReply(value), "bot");
    setTimeout(showOptions,800);
  }
}
function getLabelByValue(v){ const o = quickOptions.find(x=>x.value===v); return o? o.text: v; }

// --- Bot replies ---
function getBotReply(value){
  if(value === "precios") return "Nuestros precios: Corte desde <strong>$20.000</strong> | Barba <strong>$15.000</strong> | Paquete completo <strong>$30.000</strong>.";
  if(value === "horarios") return "⏰ Abrimos L - S: 9:00 AM - 9:00 PM. ¿Quieres agendar una cita rápida?";
  if(value === "ubicacion") return "📍 Estamos en Cra. 15 #45-20, Barranquilla. ¿Deseas que te envíe indicaciones o agendemos?";
  return "Lo siento, no entendí tu mensaje.";
}

// --- Haircut recommendation ---
function getHaircutRecommendation(faceType){
  const f = faceType.toLowerCase();
  if(f.includes("redondo")) return { text:"😀 Para rostro redondo: volumen arriba y lados cortos — Pompadour o Fade alto.", images: haircutImages.pompadour };
  if(f.includes("cuadrado")) return { text:"💪 Rostro cuadrado: textura arriba — Crew Cut o Undercut.", images: haircutImages.fade };
  if(f.includes("alargado")) return { text:"👌 Rostro alargado: volumen a los lados — Fringe o Corte clásico.", images: haircutImages.quiff };
  if(f.includes("ovalado")) return { text:"🔥 Rostro ovalado: te queda casi cualquier corte. Prueba Buzz o Quiff.", images: haircutImages.buzz };
  return { text:"🤔 No reconozco ese tipo de rostro. Intenta: redondo, cuadrado, alargado u ovalado.", images: [] };
}

// --- User text ---
function handleUserText(text){
  appendMessage(text, "user");

  if(/cita|agendar/i.test(text)){ // 🔹 Detectar cita directa
    appendMessage("Perfecto 👍 te llevaré al login para que agendes tu cita.", "bot");
    setTimeout(()=> window.location.href="../views/login.html",1500);
    return;
  }

  if(waitingForFaceType){
    const rec = getHaircutRecommendation(text);
    appendMessage(rec.text, "bot");
    if(rec.images && rec.images.length) showThumbs(rec.images);
    waitingForFaceType = false;
    return;
  }

  appendMessage("🤖 Intenta seleccionar una de las opciones del menú o escribe 'cita' para agendar.", "bot");
  setTimeout(showOptions, 700);
}

// --- Thumbnails ---
function showThumbs(urls){
  const container = document.createElement("div");
  container.className = "chat-thumb";
  urls.forEach(u=>{
    const img = document.createElement("img");
    img.src = u; img.alt="corte"; img.loading="lazy";
    img.addEventListener("click", ()=> openImageModal(u));
    container.appendChild(img);
  });
  appendMessage(container,"bot");
}

// --- Modal image ---
function openImageModal(src){
  const modal = document.createElement("div");
  modal.style="position:fixed;inset:0;display:grid;place-items:center;background:rgba(0,0,0,0.85);z-index:2000;padding:20px";
  const img=document.createElement("img");
  img.src=src; img.style="max-width:95%;max-height:90%;border-radius:10px;box-shadow:0 10px 40px rgba(0,0,0,0.6)";
  modal.appendChild(img);
  modal.addEventListener("click",()=> document.body.removeChild(modal));
  document.body.appendChild(modal);
}

// --- Care tips ---
function getCareTips(){
  return `✨ <strong>Tips rápidos:</strong>
  <ul style="margin:6px 0 0 18px;color:#ddd">
    <li>Lava tu cabello con shampoo suave 2-3 veces por semana.</li>
    <li>Usa aceite para barba a diario si la tienes.</li>
    <li>Recorta puntas cada 6-8 semanas para mantener la forma.</li>
  </ul>`;
}

// --- Voice recognition ---
function initSpeechRecognition(){
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!SpeechRecognition) return null;
  const r = new SpeechRecognition();
  r.lang = 'es-CO'; r.interimResults=false; r.maxAlternatives=1;
  r.onresult=(e)=>{ const text=e.results[0][0].transcript; handleUserText(text); };
  r.onerror=()=> appendMessage("No pude entender la voz, intenta escribir.", "bot");
  return r;
}

// --- Abrir/cerrar chat ---
function openChat(){
  chatbotBox.classList.add("open");
}
function closeChat(){
  chatbotBox.classList.remove("open");
}
chatbotToggle.addEventListener("click", ()=>{
  if(chatbotBox.classList.contains("open")) closeChat();
  else openChat();
});
if(chatbotClose) chatbotClose.addEventListener("click", closeChat);

// --- enviar mensaje ---
if(chatbotSend){
  chatbotSend.addEventListener("click", ()=>{
    const text = chatbotInput.value.trim();
    if(!text) return;
    chatbotInput.value = "";
    handleUserText(text);
  });
}
if(chatbotInput){
  chatbotInput.addEventListener("keydown", (e)=>{
    if(e.key==="Enter"){ e.preventDefault(); chatbotSend.click(); }
  });
}

// --- voice button ---
if(voiceBtn){
  voiceBtn.addEventListener("click", ()=>{
    if(!recognition){ recognition=initSpeechRecognition(); if(!recognition){ appendMessage("Tu navegador no soporta reconocimiento de voz.", "bot"); return; } }
    try{ recognition.start(); appendMessage("🎤 Grabando... habla ahora.", "bot"); }catch(e){ appendMessage("No pude iniciar el micrófono.", "bot"); }
  });
}

// --- Initial load ---
document.addEventListener("DOMContentLoaded", ()=>{
  loadHistory();
});
