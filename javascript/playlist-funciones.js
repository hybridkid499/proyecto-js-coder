// Arrays de objetos, asi en la array tengo cada objeto ( canciones) con sus datos independientes uno de otro, al principio tuve un problema con localstorage
// pero era porque habia conflicto con la array de objetos, por eso despues hice un if else para que trabaje con lo guardado sino entraba en ese bucle que se sobreescribia



// el uso de createlement en texto plano lo revise en base a lo que dijo de la sobreestructura, creo que me emocione mucho cambiando todos los inner por esta funcion.
//en base a la simplificacion de foreach en mostrarplaylist vi que habian otros casos donde habia texto plano en los que funciona bien con innerhtml entonces lo modifique nuevamente
//tratando de no tocar la parte de los imput, sino que solo el texto plano
//en varias funciones cree una sobre estructura como bien menciona, hice otro programa en paralelo como estaba estructurado con los inner en las modificaciones y el funcionamiento era el mismo con algo mas simple.
//al momento de agregar lo ultimo que vimos con las librerias, reemplace el texto plano por una funcion unica donde se implemento sweetalert. los imput quedaron iguales en funionamiento

let canciones = [];
let indiceActual = 0;

// nueva funcion con json, fetch, async. reemplazando a la anterior que no creaba el archivo. trabaja con local si existe, para probarlo con json solo le doy a eliminar playlist y ahi carga desde jason sin problemas
async function cargarCanciones() {
    
  const guardadas = JSON.parse(localStorage.getItem("playlist"));

  if (guardadas && guardadas.length > 0) {
    canciones = guardadas;
    mostrarPlaylist();
    return;
  }

  try {
    
    const respuesta = await fetch("datos-playlist/canciones.json");
    if (!respuesta.ok) throw new Error("No se pudo cargar el archivo");

    const data = await respuesta.json();
    canciones = data;
    guardarPlaylist();     
    mostrarPlaylist();    
  } catch (error) {
    mostrarMensaje("Error al cargar canciones desde archivo.");
  }
}


// mostrar la playlist ya con el comentario que me dijo sobre foreach y innerhtml, originalmente estaba todo con inner pero lo modifique despues de ver la clase donde se usaba createlement y appendchild, en ese momento cambie todo. pero ya entendi a que se referia de la estructura con foreach
function mostrarPlaylist() {
  const info = document.querySelector("#info");
  info.innerHTML = "<h2>Playlist actual:</h2>";

  canciones.forEach((cancion, index) => {
    info.innerHTML += `<p>${index + 1}. ${cancion.titulo} - ${cancion.artista} (${cancion.duracion})</p>`;
  });
}



//guardamos los datos de la array 
function guardarPlaylist() {
  localStorage.setItem("playlist", JSON.stringify(canciones));
} 




// agregar una cancion nueva. aca ya hice uso mas claro de la funcion con swwetalert como arriba en el error del catch, ya todo lo que se mostraba como texto plano menos el reproducir cancion, siguiente o anterior decidi mostrarlo con esa funcion
function agregarCancion(titulo, artista, duracion) {

   const existe = canciones.some(cancion =>
    cancion.titulo.toLowerCase() === titulo.toLowerCase() &&
    cancion.artista.toLowerCase() === artista.toLowerCase()
  );

   if (existe) {
    mostrarMensaje("Esta canción ya está en la playlist.", "warning");
    return;
  }

  canciones.push({ titulo, artista, duracion });
  guardarPlaylist();
  mostrarPlaylist(); // para ver si se actualizo bien el contenido
  mostrarMensaje("Canción agregada correctamente.", "success");
}





// buscar una cancion por titulo y artista. originalmente eran 2 funciones, pero hice que se pidan ambos parametros. mas abajo explico bien por que
//modifique ahora con inner, luego de buscar como sacar sobreestruracion, modifique el inner para que se busque internamente si no esta la cancion, sin necesidad de gran estructura como la anterior
function buscarCancionPorTituloYArtista(titulo, artista) {
  const cancion = canciones.find(c =>
    c.titulo.toLowerCase() === titulo.toLowerCase() &&
    c.artista.toLowerCase() === artista.toLowerCase()
  );

  if (cancion) {
    const info = document.querySelector("#info");
    info.innerHTML = `<p>${cancion.titulo} - ${cancion.artista} (${cancion.duracion})</p>`;
  } else {
    mostrarMensaje("Canción no encontrada.", "warning");
  }
}



// ir directamente a una cancion, se cambio con la misma logica de la anterior funcion
function irACancion(numero) {
  const objetivo = canciones.at(numero - 1);
 

  if (objetivo) {
    indiceActual = numero - 1;
    reproducirCancion();
  } else {
    mostrarMensaje("Número de canción inválido.", "error");
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



// reproducir la cancion actual, aca cambie a inner otra vez luego de mi confucion con el DOM donde en esos inputs si usaba creat y append, fue error de comprension mio donde decidi hacer revision de todo y
//cambiar directamente todos los inner, cuando la mejor solucion la entendi cuando se remarco la sobreestructura generada anteriormente.
function reproducirCancion() {
  const cancion = canciones[indiceActual];
  const esLarga = esCancionLarga();

  const info = document.querySelector("#info");
  info.innerHTML = `
    <h2>Reproduciendo:</h2>
    <p>${cancion.titulo} - ${cancion.artista} (${cancion.duracion})</p>
    ${esLarga ? "<p>Esta canción es larga (+5 min)</p>" : ""}
  `;
}


// cambia a la cancion sig, nuevamente un cambio 
//en esta funcion igual que en anterior las habia cambiado por algo distinto, pero el contador de canciones siempre me daba mal, al moverme hacia adelante y luego regresar a la primera y mas atras no salia el primera cancion 
//algo de esa esctructura no me contaba bien la posicion, se que puede que esta forma no sea la mejor pero no pude hacerla andar con otra, segun pregunte, con un contador era lo mejor si solo queria contar
//ya que la parte de lectura la hace el reproducircancion
function siguienteCancion() {
  if (indiceActual < canciones.length - 1) {
    indiceActual++;
    reproducirCancion();
  } else {
    mostrarMensaje("Última canción.", "info");
  }
}


// regresa a la anterior cancion (misam explicacion de lo anterior)
function anteriorCancion() {
  if (indiceActual > 0) {
    indiceActual--;
    reproducirCancion();
  } else {
    mostrarMensaje("Primera canción.", "info");
  }
}


// en base a ver la llamda puntual en las anteriores funciones decidi agrrgar una funcion puntual de texto para las partes de imput y la nueva parte de edicion, es la parte externa. la libreria que pase ese codigo.
//porque sinceramente me hice un quilombo de texto en la parte de abajo tremenda y estaba mucho peor en ese momento con la zona de edicion y los eventos (en el otro js)
//algunas partes como dije al principio no las termine tocando porque ya me funcionaba asi, trate de no tocar la parte de eventos con botones porque no queria romper mas de lo que tuve que arreglar otra vez

function mostrarMensaje(mensaje, tipo = "info") {
  if (typeof Swal !== "undefined") {
    Swal.fire({
      title: tipo === "success" ? "Éxito" : tipo === "error" ? "Error" : "Mensaje",
      text: mensaje,
      icon: tipo,
      confirmButtonText: "OK"
    });
  } else {
    
    const info = document.querySelector("#info");
    info.innerHTML = `<p>${mensaje}</p>`;
  }
}

//edicion, pedi tanto titulo y artista. la explicacion de no usar una y que en el caso de titulo identico pida el artista esta mas que todo vinculado a eliminar (la funcion bajo esta)
function editarCancion(tituloBuscado, artistaOriginal, nuevoTitulo, nuevoArtista, nuevaDuracion) {
  const index = canciones.findIndex(cancion => cancion.titulo.toLowerCase() === tituloBuscado.toLowerCase() &&
    cancion.artista.toLowerCase() === artistaOriginal.toLowerCase());

  if (index !== -1) {
    canciones[index].titulo = nuevoTitulo || canciones[index].titulo;
    canciones[index].artista = nuevoArtista || canciones[index].artista;
    canciones[index].duracion = nuevaDuracion || canciones[index].duracion;

    guardarPlaylist();
    mostrarPlaylist();
    mostrarMensaje("Canción editada correctamente.", "success");
  } else {
   mostrarMensaje("Canción no encontrada.", "error");
  }
}


//aca fue el problema de pedir parametros separados, cuando ingresaba eliminar titulo, si habia un titulo igual lo logico era pedir artista, bueno lo hice asi, eran dos funciones
//pero por alguna razon que obviamente errror mio, no entraba nunca a esa parte de la funcion para validar artista, aparecia el boton, la interfaz de ingreso de artista pero al momemto de borrar
//no me validaba nada y no se eliminaba, creo que fue por la forma que hice la funcion, trate de arreglar pero en varios casos me daba. decidi hacer una funcion donde directamente se pidan ambos parametros


function eliminarCancionPorTituloYArtista(titulo, artista) {
  const index = canciones.findIndex(cancion =>
    cancion.titulo.toLowerCase() === titulo.toLowerCase() &&
    cancion.artista.toLowerCase() === artista.toLowerCase()
  );

  if (index !== -1) {
    canciones.splice(index, 1);
    guardarPlaylist();
    mostrarPlaylist();
    mostrarMensaje("Canción eliminada correctamente.", "success");
  } else {
    mostrarMensaje("No se encontró una canción que coincida con ambos datos.", "error");
  }

  // ocultamos los campos
  document.querySelector("#inputEliminarTitulo").value = "";
document.querySelector("#inputEliminarArtista").value = "";
  document.querySelector("#inputEliminarArtista").classList.add("oculto");
  document.querySelector("#btnConfirmarEliminarPorArtista").classList.add("oculto");
}

cargarCanciones();