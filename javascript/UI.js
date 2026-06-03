// ─── UI Layer ─────────────────────────────────────────────────────────────────
// Responsabilidad única: leer/escribir el DOM y mostrar feedback al usuario.
// No contiene lógica de negocio. Recibe datos, los pinta.

import { esCancionLarga } from "./playlist.js";

const $info = document.querySelector("#info");
const $seccionEditar = document.querySelector("#seccionEditar");
const $btnConfirmarBorrado = document.querySelector("#btnConfirmarBorrado");

// ─── Feedback ─────────────────────────────────────────────────────────────────

export function mostrarMensaje(mensaje, tipo = "info") {
  Swal.fire({
    title: tituloPorTipo(tipo),
    text: mensaje,
    icon: tipo,
    confirmButtonText: "OK",
    buttonsStyling: false,
    customClass: {
      confirmButton: "swal-btn",
    },
  });
}

function tituloPorTipo(tipo) {
  const titulos = { success: "Listo", error: "Error", warning: "Atención", info: "Info" };
  return titulos[tipo] ?? "Mensaje";
}

// ─── Playlist ─────────────────────────────────────────────────────────────────

// onReorder es un callback que main.js inyecta: (desdeIndex, hastaIndex) => void
// Así ui.js no importa lógica de negocio — solo notifica que hubo un reorden.
export function renderPlaylist(canciones, onReorder) {
  if (canciones.length === 0) {
    $info.innerHTML = "<p class='playlist-vacia'>La playlist está vacía.</p>";
    return;
  }

  const lista = document.createElement("div");
  lista.className = "playlist-lista";

  let dragDesde = null;

  canciones.forEach((c, i) => {
    const item = document.createElement("div");
    item.className = "cancion-item";
    item.draggable = true;
    item.dataset.index = i;

    item.innerHTML = `
      <span class="drag-handle" title="Arrastrá para reordenar">⠿</span>
      <span class="cancion-numero">${i + 1}</span>
      <span class="cancion-titulo">${c.titulo}</span>
      <span class="cancion-artista">${c.artista}</span>
      <span class="cancion-duracion">${c.duracion}</span>
    `;

    // ── Eventos drag ──────────────────────────────────────────────────────────

    item.addEventListener("dragstart", (e) => {
      dragDesde = i;
      e.dataTransfer.effectAllowed = "move";
      requestAnimationFrame(() => item.classList.add("dragging"));
    });

    item.addEventListener("dragend", () => {
      item.classList.remove("dragging");
      // Limpiamos todos los indicadores visuales al soltar
      lista.querySelectorAll(".cancion-item").forEach((el) => {
        el.classList.remove("drop-arriba", "drop-abajo");
      });
      dragDesde = null;
    });

    item.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (dragDesde === null || dragDesde === i) return;

      // Calculamos si el cursor está en la mitad superior o inferior del elemento.
      // Eso determina si la inserción va ANTES o DESPUÉS de este item.
      const rect = item.getBoundingClientRect();
      const mitad = rect.top + rect.height / 2;
      const enMitadSuperior = e.clientY < mitad;

      // Limpiamos todos antes de marcar el actual
      lista.querySelectorAll(".cancion-item").forEach((el) => {
        el.classList.remove("drop-arriba", "drop-abajo");
      });

      item.classList.add(enMitadSuperior ? "drop-arriba" : "drop-abajo");
    });

    item.addEventListener("dragleave", (e) => {
      // dragleave se dispara al entrar en un hijo — verificamos que realmente
      // salimos del item y no solo entramos en un span interno
      if (!item.contains(e.relatedTarget)) {
        item.classList.remove("drop-arriba", "drop-abajo");
      }
    });

    item.addEventListener("drop", (e) => {
      e.preventDefault();

      if (dragDesde === null || dragDesde === i) return;

      // Determinamos la posición final igual que en dragover
      const rect = item.getBoundingClientRect();
      const enMitadSuperior = e.clientY < rect.top + rect.height / 2;

      // Si soltamos en la mitad superior del item i, insertamos ANTES (índice i)
      // Si soltamos en la mitad inferior, insertamos DESPUÉS (índice i)
      // Pero el modelo usa el índice destino directamente, así que ajustamos:
      let hastaIndex = enMitadSuperior ? i : i;
      // Si venimos de arriba y soltamos abajo, el índice destino es i
      // Si venimos de abajo y soltamos arriba, el índice destino es i
      // El splice del modelo se encarga del recorrido — solo necesitamos el índice final
      hastaIndex = enMitadSuperior ? i : i + 1;
      // Corregimos: si el origen está antes del destino, el índice real tras el splice es uno menos
      if (dragDesde < hastaIndex) hastaIndex--;

      item.classList.remove("drop-arriba", "drop-abajo");
      onReorder(dragDesde, hastaIndex);
    });

    lista.appendChild(item);
  });

  $info.innerHTML = "";
  $info.appendChild(lista);
}

export function renderReproduciendo(cancion) {
  const larga = esCancionLarga(cancion);

  $info.innerHTML = `
    <div class="reproduciendo">
      <p class="reproduciendo-label">▶ Reproduciendo</p>
      <p class="reproduciendo-titulo">${cancion.titulo}</p>
      <p class="reproduciendo-artista">${cancion.artista}</p>
      <p class="reproduciendo-duracion">${cancion.duracion}</p>
      ${larga ? `<p class="cancion-larga">⏱ Canción larga (+5 min)</p>` : ""}
    </div>
  `;
}

export function renderBusqueda(cancion) {
  $info.innerHTML = `
    <div class="resultado-busqueda">
      <p class="resultado-label">Resultado encontrado:</p>
      <p><strong>${cancion.titulo}</strong> — ${cancion.artista} (${cancion.duracion})</p>
    </div>
  `;
}

// ─── Formularios ──────────────────────────────────────────────────────────────

export function limpiarCampos(...ids) {
  ids.forEach((id) => {
    const el = document.querySelector(id);
    if (el) el.value = "";
  });
}

export function mostrarSeccionEditar(cancion) {
  document.querySelector("#inputEditarTitulo").value = cancion.titulo;
  document.querySelector("#inputEditarArtista").value = cancion.artista;
  document.querySelector("#inputEditarDuracion").value = cancion.duracion;
  $seccionEditar.classList.remove("oculto");
}

export function ocultarSeccionEditar() {
  $seccionEditar.classList.add("oculto");
  limpiarCampos(
    "#inputEditarBuscar",
    "#inputEditarArtistaOriginal",
    "#inputEditarTitulo",
    "#inputEditarArtista",
    "#inputEditarDuracion"
  );
}

export function mostrarConfirmarBorrado() {
  $btnConfirmarBorrado.classList.remove("oculto");
}

export function ocultarConfirmarBorrado() {
  $btnConfirmarBorrado.classList.add("oculto");
}

// ─── Helpers de lectura de inputs ─────────────────────────────────────────────

export function leerInput(id) {
  return document.querySelector(id)?.value.trim() ?? "";
}