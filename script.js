console.log("SCRIPT BASE OK");

let contenedor = document.getElementById("publicaciones");

/* ---------------------------
   DATOS FIJOS
----------------------------*/
let publicaciones = [
    {
        id: 1,
        titulo: "Salamandra",
        estado: "Usada",
        busca: "Herramientas",
        imagen: "imagenes/salamandra.jpg"
    },
    {
        id: 2,
        titulo: "Bicicleta",
        estado: "Usada",
        busca: "Notebook",
        imagen: "imagenes/bicicleta.jpg"
    },
    {
        id: 3,
        titulo: "Soporte para cortina",
        estado: "Nuevo",
        busca: "Taladro",
        imagen: "imagenes/soporte.jpg"
    }
];

/* ---------------------------
   RENDER
----------------------------*/
function renderizarPublicaciones() {

    contenedor.innerHTML = "";

    for (let p of publicaciones) {

        contenedor.innerHTML += `
        <div class="tarjeta">
            <img src="${p.imagen}" width="200">

            <h2>${p.titulo}</h2>

            <p><strong>Estado:</strong> ${p.estado}</p>

            <p><strong>Busca:</strong> ${p.busca}</p>

            <button onclick="alert('${p.titulo}')">
                Ver
            </button>
        </div>
        `;
    }
}

/* ---------------------------
   AGREGAR PUBLICACIÓN
----------------------------*/
function agregarPublicacion() {

    let titulo = document.getElementById("titulo").value;
    let estado = document.getElementById("estado").value;
    let busca = document.getElementById("busca").value;
    let imagen = document.getElementById("imagen").value;

    if (titulo === "" || estado === "" || busca === "") {
        alert("Completa todos los campos.");
        return;
    }

    let nuevaPublicacion = {
        id: publicaciones.length + 1,
        titulo: titulo,
        estado: estado,
        busca: busca,
        imagen: imagen === "" ? "imagenes/default.jpg" : imagen
    };

    publicaciones.push(nuevaPublicacion);

    renderizarPublicaciones();

    // Limpiar formulario
    document.getElementById("titulo").value = "";
    document.getElementById("estado").value = "";
    document.getElementById("busca").value = "";
    document.getElementById("imagen").value = "";
}

/* ---------------------------
   INICIALIZAR
----------------------------*/
renderizarPublicaciones();

document
    .getElementById("btnPublicar")
    .addEventListener("click", agregarPublicacion);