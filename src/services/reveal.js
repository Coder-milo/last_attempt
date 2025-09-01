// src/services/reveal.js

/**
 * Muestra el <body> solo cuando:
 *  1) El DOM está listo, y
 *  2) La hoja de estilos con id=cssId ya cargó (o tras un fallback).
 *
 * Úsalo en cada controller: revealWhenCssReady({ cssId: 'adminCss', delay: 0 })
 */
export function revealWhenCssReady({ cssId = 'adminCss', delay = 0, fallbackMs = 1500 } = {}) {
  const addReady = () => {
    if (!document.body.classList.contains('ready')) {
      // pequeño delay opcional (para suavizar)
      setTimeout(() => document.body.classList.add('ready'), delay);
    }
  };

  // Paso A: espera DOM
  const onDom = () => {
    // Paso B: espera la hoja de estilos principal
    const link = document.getElementById(cssId);

    // Si no hay link o ya está aplicada (sheet), mostramos
    if (!link || link.sheet) {
      addReady();
      return;
    }

    // Espera evento load de la CSS
    link.addEventListener('load', addReady, { once: true });

    // Fallback por si el 'load' no llega (HMR/dev/red lenta)
    setTimeout(addReady, fallbackMs);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', onDom, { once: true });
  } else {
    onDom();
  }
}

/**
 * (Opcional) Oculta el body antes de cargar una nueva vista SPA,
 * para evitar que se vea contenido previo sin estilos.
 * Llama a hideBeforeReveal() justo antes de reemplazar la vista.
 */
export function hideBeforeReveal() {
  document.body.classList.remove('ready');
}
