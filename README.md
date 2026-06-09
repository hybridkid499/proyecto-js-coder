Playlist App
App para gestionar una playlist de canciones, hecha en vanilla JavaScript sin frameworks.
Empezó como proyecto final de un curso de frontend y la fui mejorando por las mías — básicamente la reescribí completa para que el código tenga sentido más allá de que funcione.
Qué hace

Ver, agregar, editar y eliminar canciones
Navegar por la playlist (siguiente, anterior, ir a una posición específica)
Buscar por título y artista
Reordenar canciones con drag & drop — con indicador visual de dónde va a caer la canción antes de soltarla
Persiste en localStorage y carga desde un JSON si no hay nada guardado

Por qué está bueno mirar el código
Lo que más me importó al reescribirlo fue la arquitectura. Está dividido en tres capas:

playlist.js — lógica de negocio pura, ni idea de que existe el DOM
ui.js — todo lo que toca el DOM, recibe datos y los pinta
main.js — solo registra eventos y conecta las otras dos

El drag & drop está implementado con la API nativa del browser, sin librerías. Usa getBoundingClientRect() para calcular en qué mitad del elemento cae el cursor y mostrar la línea de inserción en el lugar correcto antes de soltar.
Stack

Vanilla JS con ES6 modules
CSS puro
SweetAlert2 para las alertas
Sin frameworks, sin bundler, sin magia
