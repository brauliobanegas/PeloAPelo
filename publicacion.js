let parametros = new URLSearchParams(window.location.search);

let id = parametros.get("id");

let publicacion = publicaciones.find(p => p.id == id);

document.getElementById("titulo").innerText = publicacion.titulo;

document.getElementById("imagen").src = publicacion.imagen;

document.getElementById("estado").innerText = "Estado: " + publicacion.estado;

document.getElementById("busca").innerText = "Busca: " + publicacion.busca;

document.getElementById("descripcion").innerText = publicacion.descripcion;