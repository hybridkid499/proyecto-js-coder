// Arrays de objetos, asi en la array tengo cada objeto ( canciones) con sus datos independientes uno de otro, al principio tuve un problema con localstorage
// pero era porque habia conflicto con la array de objetos, por eso despues hice un if else para que trabaje con lo guardado sino entraba en ese bucle que se sobreescribia

let canciones = [];

const datosGuardados = JSON.parse(localStorage.getItem("playlist"));

if (datosGuardados) {
  canciones = datosGuardados; // se carga lo que ya estaba guardado
} else {
  canciones = [
    { titulo: "The Summoning", artista: "Sleep Token", duracion: "6:35" },
    { titulo: "Just Pretend", artista: "Bad Omens", duracion: "3:45" },
    { titulo: "Drown", artista: "BMTH", duracion: "4:28" }
  ];
  localStorage.setItem("playlist", JSON.stringify(canciones)); // se guarda base si no había nada
}
let indiceActual = 0;

// mostrar la playlist
function mostrarPlaylist() {
  const info = document.querySelector("#info");
  info.innerHTML = ""; // Limpiar el contenido, solo use los inner para esto y en otro punto mas adelante

  const titulo = document.createElement("h2");
  titulo.textContent = "Playlist actual:";
  info.appendChild(titulo);

  canciones.forEach((cancion, index) => {
    const p = document.createElement("p");
    p.textContent = `${index + 1}. ${cancion.titulo} - ${cancion.artista} (${cancion.duracion})`;
    info.appendChild(p);
  });
}

//guardamos los datos de la array 
function guardarPlaylist() {
  localStorage.setItem("playlist", JSON.stringify(canciones));
} 




// agregar una cancion nueva 
function agregarCancion(titulo, artista, duracion) {
  canciones.push({ titulo, artista, duracion });
  guardarPlaylist();
  mostrarPlaylist(); // para ver si se actualizo bien el contenido
}





// buscar una cancon por titulo, quise agregar que se pueda buscar por artista tamnien pero decidi mantener solo esto porque ya tenia el funcionamiento verificado y no queria tocar de mas
function buscarCancion(titulo) {
  const info = document.querySelector("#info");
  info.innerHTML = "";

  const resultado = document.createElement("h2");
  resultado.textContent = "Resultado:";
  info.appendChild(resultado);

  const cancion = canciones.find(c => c.titulo.toLowerCase() === titulo.toLowerCase());

  const p = document.createElement("p");
  if (cancion) {
    p.textContent = `${cancion.titulo} - ${cancion.artista} (${cancion.duracion})`;
  } else {
    p.textContent = "🎵 Canción no encontrada.";
  }
  info.appendChild(p);
}



// ir directamente a una cancion
function irACancion(numero) {
  const objetivo = canciones.at(numero - 1); 
  if (objetivo) {
    indiceActual = numero - 1;
    reproducirCancion();
  } else {
    const info = document.querySelector("#info");
info.innerHTML = "";

const p = document.createElement("p");
p.textContent = "número de canción inválido.";
info.appendChild(p);
  }
}

// verificar si una cancion es larga, (+5 minutos) esto lo agregue como un extra, no tiene una gran funcion mas que verificar y queria mostrar algo por consola de eso
function esCancionLarga() {
  const duracion = canciones[indiceActual].duracion; // 

  const partes = duracion.split(":");
  const minutos = parseInt(partes[0]);
  const segundos = parseInt(partes[1]);

  return minutos > 5 || (minutos === 5 && segundos > 0);
}



// reproducir la cancion actual
function reproducirCancion() {
  const info = document.querySelector("#info");
  info.innerHTML = "";

  const titulo = document.createElement("h2");
  titulo.textContent = "Reproduciendo:";
  info.appendChild(titulo);

  const cancion = canciones[indiceActual];
  const p = document.createElement("p");
  p.textContent = `${cancion.titulo} - ${cancion.artista} (${cancion.duracion})`;
  info.appendChild(p);

  if (esCancionLarga()) {
    const aviso = document.createElement("p");
    aviso.textContent = "Esta canción es larga (+5 min)";
    info.appendChild(aviso);
  }
}



// cambia a la cancion sig
function siguienteCancion() {
  const siguiente = canciones.at(indiceActual + 1);
  if (siguiente) {
    indiceActual++;
    reproducirCancion();
  } else {
    const info = document.querySelector("#info");
info.innerHTML = "";
const p = document.createElement("p");
p.textContent = "última canción.";
info.appendChild(p);
  }
}



// regresa a la anterior cancion
function anteriorCancion() {
  const anterior = canciones.at(indiceActual - 1);
  if (anterior) {
    indiceActual--;
    reproducirCancion();
  } else {
    const info = document.getElementById("info");
info.innerHTML = "";
const p = document.createElement("p");
p.textContent = "primera canción.";
info.appendChild(p);
  }
}





//botones = btn
document.querySelector("#verPlaylist").addEventListener("click", mostrarPlaylist);

document.querySelector("#reproducir").addEventListener("click", reproducirCancion);


document.querySelector("#siguiente").addEventListener("click", siguienteCancion);

document.querySelector("#anterior").addEventListener("click", anteriorCancion);

// formularios con la interfaz para agregar canciones y verificar que todo este bien 

document.getElementById("btnAgregar").addEventListener("click", () => {
  const titulo = document.querySelector("#inputTitulo").value.trim();
  const artista = document.querySelector("#inputArtista").value.trim();
  const duracion = document.querySelector("#inputDuracion").value.trim();

  if (titulo && artista && duracion) {
    agregarCancion(titulo, artista, duracion);

    // para limpiar 
    document.querySelector("#inputTitulo").value = "";
    document.querySelector("#inputArtista").value = "";
    document.querySelector("#inputDuracion").value = "";

  } else {
     const info = document.querySelector("#info");
info.innerHTML = "";
const p = document.createElement("p");
p.textContent = "completá todos los campos.";
info.appendChild(p);
  }
});


// btn con el imput necesario
document.getElementById("btnBuscar").addEventListener("click", () => {
  const buscar = document.querySelector("#inputBuscar").value.trim();
  if (buscar) {
    buscarCancion(buscar);
    document.querySelector("#inputBuscar").value = "";
  } else {
     const info = document.querySelector("#info");
info.innerHTML = "";
const p = document.createElement("p");
p.textContent = "ingresá un título para buscar.";
info.appendChild(p);
  }
});



document.querySelector("#btnIrA").addEventListener("click", () => {
  const num = parseInt(document.querySelector("#inputNumero").value);
  if (!isNaN(num)) {
    irACancion(num);
    document.querySelector("#inputNumero").value = "";
  } else {
   const info = document.querySelector("#info");
info.innerHTML = "";
const p = document.createElement("p");
p.textContent = "ingresá un número válido.";
info.appendChild(p);
  }
});


//asi borramos la playlist asi como comente al principio aca es donde tenia problemas que sobreescribia la array y por eso decidi meter el if else del principio.
//la parte del boton oculta la busque como se hacia, copie y la adapte a este modelo porque por defecto estaba con otro estilo, posicion tamaño y por supuesto las variables genericas
document.querySelector("#btnBorrar").addEventListener("click", () => {
  document.querySelector("#btnConfirmarBorrado").classList.remove("oculto");

  const info = document.querySelector("#info");
info.innerHTML = "";
const p = document.createElement("p");
p.textContent = "haz clic en 'Confirmar borrado' para eliminar playlist.";
info.appendChild(p);
});



document.querySelector("#btnConfirmarBorrado").addEventListener("click", () => {
  canciones.length = 0;
  localStorage.removeItem("playlist");

  const info = document.querySelector("#info");
  info.innerHTML = "";
  const p = document.createElement("p");

  p.textContent = "playlist borrada.";
  info.appendChild(p);

  document.querySelector("#btnConfirmarBorrado").classList.add("oculto");
});
