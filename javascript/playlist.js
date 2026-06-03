// ─── Playlist Model ───────────────────────────────────────────────────────────
// Toda la lógica de negocio vive acá. Nada de DOM, nada de alertas.
// Las funciones retornan { ok, mensaje, data? } para que la UI decida qué hacer.

const STORAGE_KEY = "playlist";
const DURACION_REGEX = /^\d{1,2}:\d{2}$/;

let canciones = [];
let indiceActual = 0;

// ─── Persistencia ─────────────────────────────────────────────────────────────

function guardar() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(canciones));
}

export async function cargarCanciones() {
  const guardadas = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (guardadas && guardadas.length > 0) {
    canciones = guardadas;
    return { ok: true };
  }

  try {
    const respuesta = await fetch("datos-playlist/canciones.json");
    if (!respuesta.ok) throw new Error("Fetch fallido");
    canciones = await respuesta.json();
    guardar();
    return { ok: true };
  } catch {
    return { ok: false, mensaje: "No se pudieron cargar las canciones desde el archivo." };
  }
}

// ─── Getters ──────────────────────────────────────────────────────────────────

export function getCanciones() {
  // Retorna copia para que nadie mute el array externo
  return [...canciones];
}

export function getCancionActual() {
  return canciones[indiceActual] ?? null;
}

export function getIndiceActual() {
  return indiceActual;
}

// ─── Navegación ───────────────────────────────────────────────────────────────

export function irASiguiente() {
  if (indiceActual >= canciones.length - 1) {
    return { ok: false, mensaje: "Ya estás en la última canción." };
  }
  indiceActual++;
  return { ok: true, data: canciones[indiceActual] };
}

export function irAAnterior() {
  if (indiceActual <= 0) {
    return { ok: false, mensaje: "Ya estás en la primera canción." };
  }
  indiceActual--;
  return { ok: true, data: canciones[indiceActual] };
}

export function irANumero(numero) {
  const index = numero - 1;
  if (index < 0 || index >= canciones.length) {
    return { ok: false, mensaje: `No existe una canción en la posición ${numero}.` };
  }
  indiceActual = index;
  return { ok: true, data: canciones[indiceActual] };
}

// ─── CRUD ─────────────────────────────────────────────────────────────────────

export function agregarCancion(titulo, artista, duracion) {
  if (!DURACION_REGEX.test(duracion)) {
    return { ok: false, mensaje: "Formato de duración inválido. Usá mm:ss (ej: 3:45)." };
  }

  const duplicada = canciones.some(
    (c) =>
      c.titulo.toLowerCase() === titulo.toLowerCase() &&
      c.artista.toLowerCase() === artista.toLowerCase()
  );

  if (duplicada) {
    return { ok: false, mensaje: "Esa canción ya existe en la playlist." };
  }

  canciones.push({ titulo, artista, duracion });
  guardar();
  return { ok: true, mensaje: `"${titulo}" agregada correctamente.` };
}

export function editarCancion(tituloBuscado, artistaBuscado, nuevoTitulo, nuevoArtista, nuevaDuracion) {
  if (!DURACION_REGEX.test(nuevaDuracion)) {
    return { ok: false, mensaje: "Formato de duración inválido. Usá mm:ss (ej: 3:45)." };
  }

  const index = canciones.findIndex(
    (c) =>
      c.titulo.toLowerCase() === tituloBuscado.toLowerCase() &&
      c.artista.toLowerCase() === artistaBuscado.toLowerCase()
  );

  if (index === -1) {
    return { ok: false, mensaje: "No se encontró la canción para editar." };
  }

  canciones[index] = { titulo: nuevoTitulo, artista: nuevoArtista, duracion: nuevaDuracion };
  guardar();
  return { ok: true, mensaje: `"${nuevoTitulo}" editada correctamente.` };
}

export function eliminarCancion(titulo, artista) {
  const index = canciones.findIndex(
    (c) =>
      c.titulo.toLowerCase() === titulo.toLowerCase() &&
      c.artista.toLowerCase() === artista.toLowerCase()
  );

  if (index === -1) {
    return { ok: false, mensaje: "No se encontró ninguna canción con esos datos." };
  }

  // Si eliminamos la canción actual o una anterior, ajustamos el índice
  if (indiceActual >= index && indiceActual > 0) {
    indiceActual--;
  }

  const [eliminada] = canciones.splice(index, 1);
  guardar();
  return { ok: true, mensaje: `"${eliminada.titulo}" eliminada correctamente.` };
}

export function buscarCancion(titulo, artista) {
  const encontrada = canciones.find(
    (c) =>
      c.titulo.toLowerCase() === titulo.toLowerCase() &&
      c.artista.toLowerCase() === artista.toLowerCase()
  );

  if (!encontrada) {
    return { ok: false, mensaje: "No se encontró ninguna canción con esos datos." };
  }

  return { ok: true, data: encontrada };
}

export function encontrarParaEditar(titulo, artista) {
  const cancion = canciones.find(
    (c) =>
      c.titulo.toLowerCase() === titulo.toLowerCase() &&
      c.artista.toLowerCase() === artista.toLowerCase()
  );

  return cancion ?? null;
}

export function moverCancion(desdeIndex, hastaIndex) {
  if (
    desdeIndex === hastaIndex ||
    desdeIndex < 0 ||
    hastaIndex < 0 ||
    desdeIndex >= canciones.length ||
    hastaIndex >= canciones.length
  ) {
    return { ok: false };
  }

  // Sacamos la canción del origen y la insertamos en el destino
  const [cancionMovida] = canciones.splice(desdeIndex, 1);
  canciones.splice(hastaIndex, 0, cancionMovida);

  // Mantenemos indiceActual apuntando a la misma canción después del reorden
  if (indiceActual === desdeIndex) {
    indiceActual = hastaIndex;
  } else if (desdeIndex < indiceActual && hastaIndex >= indiceActual) {
    indiceActual--;
  } else if (desdeIndex > indiceActual && hastaIndex <= indiceActual) {
    indiceActual++;
  }

  guardar();
  return { ok: true };
}

export function borrarPlaylist() {
  canciones = [];
  indiceActual = 0;
  localStorage.removeItem(STORAGE_KEY);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function esCancionLarga(cancion) {
  const [minutos, segundos] = cancion.duracion.split(":").map(Number);
  return minutos > 5 || (minutos === 5 && segundos > 0);
}