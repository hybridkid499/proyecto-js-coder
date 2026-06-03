// ─── Entry Point ──────────────────────────────────────────────────────────────
// Este archivo únicamente registra event listeners y coordina modelo con UI.
// Si encontrás lógica de negocio acá, no pertenece a este archivo.

import {
  cargarCanciones,
  getCanciones,
  getCancionActual,
  irASiguiente,
  irAAnterior,
  irANumero,
  agregarCancion,
  editarCancion,
  eliminarCancion,
  buscarCancion,
  encontrarParaEditar,
  borrarPlaylist,
  moverCancion,
} from "./playlist.js";

import {
  mostrarMensaje,
  renderPlaylist,
  renderReproduciendo,
  renderBusqueda,
  limpiarCampos,
  mostrarSeccionEditar,
  ocultarSeccionEditar,
  mostrarConfirmarBorrado,
  ocultarConfirmarBorrado,
  leerInput,
} from "./ui.js";

// ─── Callback de reorden ──────────────────────────────────────────────────────
// Definido una vez, se pasa como argumento a cada renderPlaylist.
// Cuando el usuario suelta un elemento, ui.js llama esto con los índices.

function handleReorder(desdeIndex, hastaIndex) {
  const resultado = moverCancion(desdeIndex, hastaIndex);
  if (resultado.ok) {
    renderPlaylist(getCanciones(), handleReorder);
  }
}

// ─── Inicialización ───────────────────────────────────────────────────────────

(async () => {
  const resultado = await cargarCanciones();
  if (!resultado.ok) {
    mostrarMensaje(resultado.mensaje, "error");
    return;
  }
  renderPlaylist(getCanciones(), handleReorder);
})();

// ─── Navegación ───────────────────────────────────────────────────────────────

document.querySelector("#verPlaylist").addEventListener("click", () => {
  renderPlaylist(getCanciones(), handleReorder);
});

document.querySelector("#reproducir").addEventListener("click", () => {
  const cancion = getCancionActual();
  if (!cancion) {
    mostrarMensaje("No hay ninguna canción cargada.", "warning");
    return;
  }
  renderReproduciendo(cancion);
});

document.querySelector("#siguiente").addEventListener("click", () => {
  const resultado = irASiguiente();
  if (!resultado.ok) {
    mostrarMensaje(resultado.mensaje, "info");
    return;
  }
  renderReproduciendo(resultado.data);
});

document.querySelector("#anterior").addEventListener("click", () => {
  const resultado = irAAnterior();
  if (!resultado.ok) {
    mostrarMensaje(resultado.mensaje, "info");
    return;
  }
  renderReproduciendo(resultado.data);
});

// ─── Ir a canción por número ──────────────────────────────────────────────────

document.querySelector("#btnIrA").addEventListener("click", () => {
  const numero = parseInt(leerInput("#inputNumero"));

  if (isNaN(numero)) {
    mostrarMensaje("Ingresá un número válido.", "warning");
    return;
  }

  const resultado = irANumero(numero);
  if (!resultado.ok) {
    mostrarMensaje(resultado.mensaje, "warning");
    return;
  }

  renderReproduciendo(resultado.data);
  limpiarCampos("#inputNumero");
});

// ─── Agregar canción ──────────────────────────────────────────────────────────

document.querySelector("#btnAgregar").addEventListener("click", () => {
  const titulo = leerInput("#inputTitulo");
  const artista = leerInput("#inputArtista");
  const duracion = leerInput("#inputDuracion");

  if (!titulo || !artista || !duracion) {
    mostrarMensaje("Completá todos los campos para agregar una canción.", "warning");
    return;
  }

  const resultado = agregarCancion(titulo, artista, duracion);
  mostrarMensaje(resultado.mensaje, resultado.ok ? "success" : "warning");

  if (resultado.ok) {
    renderPlaylist(getCanciones(), handleReorder);
    limpiarCampos("#inputTitulo", "#inputArtista", "#inputDuracion");
  }
});

// ─── Buscar canción ───────────────────────────────────────────────────────────

document.querySelector("#btnBuscar").addEventListener("click", () => {
  const titulo = leerInput("#inputBuscarTitulo");
  const artista = leerInput("#inputBuscarArtista");

  if (!titulo || !artista) {
    mostrarMensaje("Completá título y artista para buscar.", "warning");
    return;
  }

  const resultado = buscarCancion(titulo, artista);

  if (!resultado.ok) {
    mostrarMensaje(resultado.mensaje, "warning");
    return;
  }

  renderBusqueda(resultado.data);
  limpiarCampos("#inputBuscarTitulo", "#inputBuscarArtista");
});

// ─── Editar canción ───────────────────────────────────────────────────────────

document.querySelector("#btnEditar").addEventListener("click", () => {
  const titulo = leerInput("#inputEditarBuscar");
  const artista = leerInput("#inputEditarArtistaOriginal");

  if (!titulo || !artista) {
    mostrarMensaje("Completá título y artista para buscar la canción.", "warning");
    return;
  }

  const cancion = encontrarParaEditar(titulo, artista);

  if (!cancion) {
    mostrarMensaje("No se encontró la canción para editar.", "warning");
    return;
  }

  mostrarSeccionEditar(cancion);
});

document.querySelector("#btnEditarConfirmar").addEventListener("click", () => {
  const tituloBuscado = leerInput("#inputEditarBuscar");
  const artistaBuscado = leerInput("#inputEditarArtistaOriginal");
  const nuevoTitulo = leerInput("#inputEditarTitulo");
  const nuevoArtista = leerInput("#inputEditarArtista");
  const nuevaDuracion = leerInput("#inputEditarDuracion");

  if (!nuevoTitulo || !nuevoArtista || !nuevaDuracion) {
    mostrarMensaje("Completá todos los campos de edición.", "warning");
    return;
  }

  Swal.fire({
    title: "¿Confirmar edición?",
    text: `¿Guardar cambios en "${tituloBuscado}" de "${artistaBuscado}"?`,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Sí, editar",
    cancelButtonText: "Cancelar",
    buttonsStyling: false,
    customClass: {
      confirmButton: "swal-btn",
      cancelButton: "swal-btn swal-btn--cancel",
    },
  }).then((result) => {
    if (!result.isConfirmed) return;

    const resultado = editarCancion(
      tituloBuscado,
      artistaBuscado,
      nuevoTitulo,
      nuevoArtista,
      nuevaDuracion
    );

    mostrarMensaje(resultado.mensaje, resultado.ok ? "success" : "error");

    if (resultado.ok) {
      renderPlaylist(getCanciones(), handleReorder);
      ocultarSeccionEditar();
    }
  });
});

// ─── Eliminar canción ─────────────────────────────────────────────────────────

document.querySelector("#btnEliminarCancion").addEventListener("click", () => {
  const titulo = leerInput("#inputEliminarTitulo");
  const artista = leerInput("#inputEliminarArtista");

  if (!titulo || !artista) {
    mostrarMensaje("Completá título y artista para eliminar.", "warning");
    return;
  }

  Swal.fire({
    title: "¿Estás seguro?",
    text: `¿Eliminar "${titulo}" de "${artista}"?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    buttonsStyling: false,
    customClass: {
      confirmButton: "swal-btn",
      cancelButton: "swal-btn swal-btn--cancel",
    },
  }).then((result) => {
    if (!result.isConfirmed) return;

    const resultado = eliminarCancion(titulo, artista);
    mostrarMensaje(resultado.mensaje, resultado.ok ? "success" : "error");

    if (resultado.ok) {
      renderPlaylist(getCanciones(), handleReorder);
      limpiarCampos("#inputEliminarTitulo", "#inputEliminarArtista");
    }
  });
});

// ─── Borrar playlist ──────────────────────────────────────────────────────────

document.querySelector("#btnBorrar").addEventListener("click", () => {
  mostrarConfirmarBorrado();
  mostrarMensaje("Hacé clic en 'Confirmar borrado' para eliminar toda la playlist.", "warning");
});

document.querySelector("#btnConfirmarBorrado").addEventListener("click", () => {
  borrarPlaylist();
  renderPlaylist(getCanciones(), handleReorder);
  ocultarConfirmarBorrado();
  mostrarMensaje("Playlist eliminada.", "success");
});