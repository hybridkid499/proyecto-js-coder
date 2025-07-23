




//botones = btn
document.querySelector("#verPlaylist").addEventListener("click", mostrarPlaylist);

document.querySelector("#reproducir").addEventListener("click", reproducirCancion);


document.querySelector("#siguiente").addEventListener("click", siguienteCancion);

document.querySelector("#anterior").addEventListener("click", anteriorCancion);

// formularios con la interfaz para agregar canciones y verificar que todo este bien, con la parte que comento donde en duracion antes se podia ingresar cualquier cosa pero ahora usando el mostrarmensaje

document.getElementById("btnAgregar").addEventListener("click", () => {
  const titulo = document.querySelector("#inputTitulo").value.trim();
  const artista = document.querySelector("#inputArtista").value.trim();
  const duracion = document.querySelector("#inputDuracion").value.trim();

  if (titulo && artista && duracion) {
    const formatoValido = /^\d{1,2}:\d{2}$/.test(duracion);
    if (!formatoValido) {
      mostrarMensaje("Formato inválido. Usá mm:ss.", "warning");
      return;
    }

    agregarCancion(titulo, artista, duracion);
    mostrarMensaje("Canción agregada correctamente.", "success");

    document.querySelector("#inputTitulo").value = "";
    document.querySelector("#inputArtista").value = "";
    document.querySelector("#inputDuracion").value = "";
  } else {
    mostrarMensaje("Completá todos los campos para agregar una canción.", "warning");
  }
});







// buscar, una de las partes donde antes habian dos validaciones individuales que comente en el playlist-funciones
document.querySelector("#btnBuscar").addEventListener("click", () => {
  const titulo = document.querySelector("#inputBuscarTitulo").value.trim();
  const artista = document.querySelector("#inputBuscarArtista").value.trim();

  if (titulo && artista) {
    buscarCancionPorTituloYArtista(titulo, artista);

    document.querySelector("#inputBuscarTitulo").value = "";
    document.querySelector("#inputBuscarArtista").value = "";
  } else {
    mostrarMensaje("Completá el título y el artista para buscar una canción.");
  }
});

//aca originalmente habia un mostrarmensaje al momento de implementar librerias pero vi que era raro que ir a cacnion fuese por la alerta esa y mejor regrese a como estaba antes, ahora solo quedo la validacion interna del iracancion
//al momento de revisar codigo vi que esta forma vieja no entra al else porque el cambio de la funcion que llama lo puse ahi mismo, esta parte es mas vieja en el programa
document.querySelector("#btnIrA").addEventListener("click", () => {
  const num = parseInt(document.querySelector("#inputNumero").value);
  if (!isNaN(num)) {
    irACancion(num);
    document.querySelector("#inputNumero").value = "";
  } else {
    mostrarMensaje("Ingresá un número válido.", "warning");
  }
});


//esta es la parte complicada que me llevo a todo el problema que mencione antes. en la primera parte se borra toda la playlist y fue necesaria para la implementacion completa del json. salta la alerta antes del boorado

document.querySelector("#btnBorrar").addEventListener("click", () => {
  document.querySelector("#btnConfirmarBorrado").classList.remove("oculto");

  mostrarMensaje("Haz clic en 'Confirmar borrado' para eliminar la playlist.", "warning");
});

// Botón para confirmar y ejecutar el borrado completo, aca ya si se elimina, con al confirmacion visual del borrado y en la parte baja se muestra la "playlist vacia" o sea ya no hay ningun campo en la parte visual del html de playlist
document.querySelector("#btnConfirmarBorrado").addEventListener("click", () => {
  localStorage.removeItem("playlist");
  canciones = [];
  mostrarPlaylist();
  mostrarMensaje("Playlist eliminada correctamente.", "success");
  document.querySelector("#btnConfirmarBorrado").classList.add("oculto");
});

//para eliminar una cancion requiere ingresar ambos campos de titulo y artista por estos problemas que tuve al hacerlo individual, esto casi que fue reescrito a como estaba antes
//la parte del if implemente una parte de codigo ya fabricada de la libreria para la verificacion, con los problemas para confrimar eliminado si habian dos canciones iguales pero distinto artista lo termine haciendo doble parametro


document.querySelector("#btnEliminarCancion").addEventListener("click", () => {
  const titulo = document.querySelector("#inputEliminarTitulo").value.trim();
  const artista = document.querySelector("#inputEliminarArtista").value.trim();

  if (titulo && artista) {
    Swal.fire({
      title: "¿Estás seguro?",
      text: `¿Eliminar la canción "${titulo}" de "${artista}"?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {     //luego aca despues de la verificacion corre la eliminacion y muestra nuevamente la alerta y limpia el campo como en otras partes de codigo
        eliminarCancionPorTituloYArtista(titulo, artista);
        mostrarMensaje("Canción eliminada correctamente.", "success");
        document.querySelector("#inputEliminarTitulo").value = "";
        document.querySelector("#inputEliminarArtista").value = "";
      }
    });
  } else {
    mostrarMensaje("Completá título y artista para eliminar una canción.");
  }
});

//esta parte tambien me llevo un poco de investigacion con el tema de ambos parametros porque para hacer un titulo y despues pedir otro fue el mismo problema
//directamente pide ambos parametros para modificar la cancion, asi busca ambos y luego muestra el input oculto para editar lo que sea necesario
//los if al principio senti que quedaron raros pero es la mejor forma que encontre de hacer la estructura, puede que haya algo mejor al igual que en la parte de editarconfirmar
document.querySelector("#btnEditar").addEventListener("click", () => {
  const titulo = document.querySelector("#inputEditarBuscar").value.trim();
  const artista = document.querySelector("#inputEditarArtistaOriginal").value.trim();

  if (titulo && artista) {
    const index = canciones.findIndex(c =>
      c.titulo.toLowerCase() === titulo.toLowerCase() &&
      c.artista.toLowerCase() === artista.toLowerCase()
    );

    if (index !== -1) {
      document.querySelector("#seccionEditar").classList.remove("oculto");
      document.querySelector("#inputEditarTitulo").value = canciones[index].titulo;
      document.querySelector("#inputEditarArtista").value = canciones[index].artista;
      document.querySelector("#inputEditarDuracion").value = canciones[index].duracion;
    } else {
      mostrarMensaje("Canción no encontrada para editar.", "warning");
      document.querySelector("#seccionEditar").classList.add("oculto");
    }
  } else {
    mostrarMensaje("Completá título y artista para buscar la canción.", "warning");
  }
});

// ahora aca si, se toman los valores ingresados como nuevo, haciendo la validacion de duracion igual que en otras partes. 

document.querySelector("#btnEditarConfirmar").addEventListener("click", () => {
  const tituloOriginal = document.querySelector("#inputEditarBuscar").value.trim();
  const artistaOriginal = document.querySelector("#inputEditarArtistaOriginal").value.trim();

  const nuevoTitulo = document.querySelector("#inputEditarTitulo").value.trim();
  const nuevoArtista = document.querySelector("#inputEditarArtista").value.trim();
  const nuevaDuracion = document.querySelector("#inputEditarDuracion").value.trim();

  if (nuevoTitulo && nuevoArtista && nuevaDuracion) {
    const duracionValida = /^\d{1,2}:\d{2}$/.test(nuevaDuracion);
    if (!duracionValida) {
      mostrarMensaje("Formato de duración inválido. Usá mm:ss.");
      return;
    }
  //use otra parte como en eliminar porque me parecio muy interesante el uso de la libreria, me ahorro varias partes de codigo pero aca busque esa parte que tenga la verificacion interna para editar 
    Swal.fire({
      title: "¿Confirmar edición?",
      text: `¿Querés guardar los cambios en "${tituloOriginal}" de "${artistaOriginal}"?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Sí, editar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        editarCancion(tituloOriginal, artistaOriginal, nuevoTitulo, nuevoArtista, nuevaDuracion);  //ahora si ejecuta la edicion con los parametros

        // Limpia los campos como antes y alerta de condirmaciones
        document.querySelector("#inputEditarBuscar").value = "";
        document.querySelector("#inputEditarArtistaOriginal").value = "";
        document.querySelector("#inputEditarTitulo").value = "";
        document.querySelector("#inputEditarArtista").value = "";
        document.querySelector("#inputEditarDuracion").value = "";
        document.querySelector("#seccionEditar").classList.add("oculto");

        mostrarMensaje("Canción editada correctamente.", "success");
      }
    });
  } else {
    mostrarMensaje("Completá todos los campos de edición.");
  }
});

