// Arrays de datos
const canciones = ["The Summoning", "Just Pretend", "Drown"];
const artistas = ["Sleep Token", "Bad Omens", "BMTH"];
const duraciones = ["6:35", "3:45", "4:28"];

let indiceActual = 0;

// mostrar la playlist
function mostrarPlaylist() {
  
  console.log("🎶 Playlist actual:");

  let i = 0;
  for (const cancion of canciones) {
    console.log(`${i + 1}. ${cancion} - ${artistas[i]} (${duraciones[i]})`);
    i++;
  }
}


// agregar una cancion nueva 
function agregarCancion(titulo, artista, duracion) {
  canciones.push(titulo);
  artistas.push(artista);
  duraciones.push(duracion);
  alert("Canción agregada.");
}

// buscar una cancon por titulo
function buscarCancion(titulo) {
  let encontrado = false;
  let i = 0;

  for (const cancion of canciones) {
    if (cancion.toLowerCase() === titulo.toLowerCase()) {
      alert(` ${canciones[i]} - ${artistas[i]} (${duraciones[i]})`);
      encontrado = true;
      break;
    }
    i++;
  }

  if (!encontrado) {
    alert("Canción no encontrada.");
  }
}

// ir directamente a una cancion
function irACancion(numero) {
  if (numero >= 1 && numero <= canciones.length) {
    indiceActual = numero - 1;
    reproducirCancion();
  } else {
    alert("Número inválido.");
  }
}

// verificar si una cancion es larga, (+5 minutos) esto lo agregue como un extra, no tiene una gran funcion mas que verificar y queria mostrar algo por consola de eso
function esCancionLarga() {
  const duracion = duraciones[indiceActual];
  const partes = duracion.split(":");
  const minutos = parseInt(partes[0]);
  const segundos = parseInt(partes[1]);

  return minutos > 5 || (minutos === 5 && segundos > 0);
}

// reproducir la cancion actual
function reproducirCancion() {
 
  console.log(`🎵 Reproduciendo: ${canciones[indiceActual]} - ${artistas[indiceActual]} (${duraciones[indiceActual]})`);
  if (esCancionLarga()) {
    console.log("Esta canción es larga (+5 min)");
  }
}

// cambiar a sig cancion
function siguienteCancion() {
  if (indiceActual < canciones.length - 1) {
    indiceActual++;
    reproducirCancion();
  } else {
    alert("Última canción.");
  }
}
// retrocede a la anterior cancion
function anteriorCancion() {
  if (indiceActual > 0) {
    indiceActual--;
    reproducirCancion();
  } else {
    alert("Primera canción.");
  }
}


function menu() {
  console.log("...");
  const opcion = prompt(
    "🎧 SIMULADOR PLAYLIST\n\n" +
    "1. Ver playlist\n" +
    "2. Reproducir canción actual\n" +
    "3. Siguiente canción\n" +
    "4. Canción anterior\n" +
    "5. Agregar canción\n" +
    "6. Buscar canción\n" +
    "7. Ir a canción por número\n" +
    "0. Salir"
  );


  // tuve un tema con los prompt en el menu al desplegarse, sinceramente no pude ver que era pero por momentos no me cargaba o tardaba mucho en desplegarse,
  // tenia que cambiar de pestaña para que cargue el menu. estuve investigando un poco, vi unos videos y en internet decia que con un timeout le daba un tiempo para que imprima por consola
  // porque no imprimia por momentos cuando sucedia entonces segun vi, con incluirlo funcionaba mejor asi que si pude "resolver" eso. para siguiente entrega buscare si hay una forma mas eficiente
  // sin tener que usar muchas lineas con el timeout. puede que englobando todo el switch en timer pero no quise modificar mucho en este punto porque ya funionaba mejor
  // pero prometo investigar mas de eso, tambien segun vi podia ser cosa de brave, no me dejaba entrar a consola el navegador en un principio. solo con f12 pero despues del timeout si anduvo la consola
  switch (opcion) {
    case "1":
      mostrarPlaylist();
      console.log("...");
      setTimeout(menu, 300);
      return;

    case "2":
      reproducirCancion();
      console.log("...");
      setTimeout(menu, 300);
      return;

    case "3":
      siguienteCancion();
      setTimeout(menu, 300);
      return;

    case "4":
      anteriorCancion();
      setTimeout(menu, 300);
      return;

    case "5":
      const t = prompt("Título:");
      const a = prompt("Artista:");
      const d = prompt("Duración (mm:ss):");
      agregarCancion(t, a, d);
      console.log("...");
      setTimeout(menu, 300);
      return;

    case "6":
      const buscar = prompt("Título a buscar:");
      buscarCancion(buscar);
      console.log("...");
      setTimeout(menu, 300);
      return;

    case "7":
      const num = parseInt(prompt("Número de canción:"));
      irACancion(num);
      console.log("...");
      setTimeout(menu, 300);
      return;

    case "0":
      alert("Hasta la próxima");
      return;

    default:
      alert("Opción no válida.");
      console.log("...");
      setTimeout(menu, 300);
      return;
  }
}


// Iniciar menú
window.onload = () => {
  console.log("Página cargada");
  setTimeout(() => {
    menu();
  }, 100); 
};


