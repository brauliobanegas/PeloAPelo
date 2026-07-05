console.log("SCRIPT BASE OK");

let contenedor = document.getElementById("publicaciones");

/* ---------------------------
   BUSCADOR
----------------------------*/
let inputBuscador = document.getElementById("buscador");

if (inputBuscador) {
    inputBuscador.addEventListener("input", function () {
        renderizarPublicaciones(this.value);
    });
}

/* ---------------------------
   STORAGE
----------------------------*/
function guardarPublicaciones() {
    localStorage.setItem("publicaciones", JSON.stringify(publicaciones));
}

/* ---------------------------
   DATOS
----------------------------*/
let publicaciones = JSON.parse(localStorage.getItem("publicaciones"));

if (!publicaciones) {
    publicaciones = [
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
}

/* ---------------------------
   RENDER
----------------------------*/
function renderizarPublicaciones(filtro = "") {

    contenedor.innerHTML = "";

    for (let p of publicaciones) {

        if (filtro && !p.titulo.toLowerCase().includes(filtro.toLowerCase())) {
            continue;
        }

        contenedor.innerHTML += `
        <div class="tarjeta">
            <img src="${p.imagen}" width="200">

            <h2>${p.titulo}</h2>

            <p><strong>Estado:</strong> ${p.estado}</p>
            <p><strong>Busca:</strong> ${p.busca}</p>

            <button onclick="eliminarPublicacion(${p.id})">
                Eliminar
            </button>

            <button onclick="editarPublicacion(${p.id})">
                Editar
            </button>

            <button onclick="alert('Publicación: ${p.titulo}')">
                Ver
            </button>
        </div>
        `;
    }
}

/* ---------------------------
   VARIABLES
----------------------------*/
let editandoId = null;

/* ---------------------------
   AGREGAR / EDITAR
----------------------------*/
function agregarPublicacion() {

    let titulo = document.getElementById("titulo").value;
    let estado = document.getElementById("estado").value;
    let busca = document.getElementById("busca").value;
    let archivo = document.getElementById("imagen").files[0];
    let imagen = archivo ? URL.createObjectURL(archivo) : "";

    if (!titulo || !estado || !busca) {
        alert("Completa todos los campos.");
        return;
    }

    if (editandoId !== null) {

        let pub = publicaciones.find(p => p.id === editandoId);

        pub.titulo = titulo;
        pub.estado = estado;
        pub.busca = busca;
        pub.imagen = imagen || "imagenes/default.jpg";

        editandoId = null;

    } else {

        let nuevaPublicacion = {
            id: publicaciones.length > 0 ? Math.max(...publicaciones.map(p => p.id)) + 1 : 1,
            titulo,
            estado,
            busca,
            imagen: imagen || "imagenes/default.jpg"
        };

        publicaciones.push(nuevaPublicacion);
    }

    guardarPublicaciones();
    renderizarPublicaciones();

    document.getElementById("titulo").value = "";
    document.getElementById("estado").value = "";
    document.getElementById("busca").value = "";
    document.getElementById("imagen").value = "";
}

/* ---------------------------
   ELIMINAR
----------------------------*/
function eliminarPublicacion(id) {

    publicaciones = publicaciones.filter(p => p.id !== id);

    guardarPublicaciones();
    renderizarPublicaciones();
}

/* ---------------------------
   EDITAR
----------------------------*/
function editarPublicacion(id) {

    let pub = publicaciones.find(p => p.id === id);

    if (!pub) return;

    document.getElementById("titulo").value = pub.titulo;
    document.getElementById("estado").value = pub.estado;
    document.getElementById("busca").value = pub.busca;
    document.getElementById("imagen").value = pub.imagen;

    editandoId = id;
}

/* ---------------------------
   INIT
----------------------------*/
renderizarPublicaciones();

document.getElementById("btnPublicar")
    .addEventListener("click", agregarPublicacion);

console.log("LLEGUÉ AL FINAL DEL SCRIPT");
console.log(typeof editarPublicacion);