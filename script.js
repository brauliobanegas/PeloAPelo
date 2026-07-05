console.log("SCRIPT BASE OK");

let contenedor = document.getElementById("publicaciones");

/* ---------------------------
   BUSCADOR + FILTRO
----------------------------*/
let inputBuscador = document.getElementById("buscador");
let filtroCategoria = document.getElementById("filtroCategoria");

if (inputBuscador) {
    inputBuscador.addEventListener("input", function () {
        renderizarPublicaciones(this.value, filtroCategoria?.value || "");
    });
}

if (filtroCategoria) {
    filtroCategoria.addEventListener("change", function () {
        renderizarPublicaciones(inputBuscador?.value || "", this.value);
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
            categoria: "Herramientas",
            busca: "Herramientas",
            imagen: "imagenes/salamandra.jpg"
        },
        {
            id: 2,
            titulo: "Bicicleta",
            estado: "Usada",
            categoria: "Deportes",
            busca: "Notebook",
            imagen: "imagenes/bicicleta.jpg"
        },
        {
            id: 3,
            titulo: "Soporte para cortina",
            estado: "Nuevo",
            categoria: "Hogar",
            busca: "Taladro",
            imagen: "imagenes/soporte.jpg"
        }
    ];
}

/* ---------------------------
   RENDER
----------------------------*/
function renderizarPublicaciones(filtro = "", categoria = "") {

    contenedor.innerHTML = "";

    for (let p of publicaciones) {

        if (filtro && !p.titulo.toLowerCase().includes(filtro.toLowerCase())) continue;

        if (categoria && p.categoria !== categoria) continue;

        contenedor.innerHTML += `
        <div class="tarjeta">
            <img src="${p.imagen}" width="200">

            <h2>${p.titulo}</h2>

            <p><strong>Estado:</strong> ${p.estado}</p>
            <p><strong>Categoría:</strong> ${p.categoria}</p>
            <p><strong>Busca:</strong> ${p.busca}</p>

            <button onclick="eliminarPublicacion(${p.id})">Eliminar</button>
            <button onclick="editarPublicacion(${p.id})">Editar</button>
            <button onclick="alert('Publicación: ${p.titulo}')">Ver</button>
        </div>
        `;
    }
}

/* ---------------------------
   VARIABLES
----------------------------*/
let editandoId = null;

/* ---------------------------
   AGREGAR / EDITAR (CORREGIDO)
----------------------------*/
function agregarPublicacion() {

    let titulo = document.getElementById("titulo").value;
    let estado = document.getElementById("estado").value;
    let categoria = document.getElementById("categoria").value;
    let busca = document.getElementById("busca").value;
    let archivo = document.getElementById("imagen").files[0];

    if (!titulo || !estado || !categoria || !busca) {
        alert("Completa todos los campos.");
        return;
    }

    if (archivo) {

        let reader = new FileReader();

        reader.onload = function (e) {

            guardar(e.target.result);
        };

        reader.readAsDataURL(archivo);

    } else {
        guardar("");
    }

    function guardar(img) {

        if (editandoId !== null) {

            let pub = publicaciones.find(p => p.id === editandoId);

            pub.titulo = titulo;
            pub.estado = estado;
            pub.categoria = categoria;
            pub.busca = busca;

            if (img) pub.imagen = img;

            editandoId = null;

        } else {

            let nuevoId = publicaciones.length > 0
                ? Math.max(...publicaciones.map(p => p.id)) + 1
                : 1;

            publicaciones.push({
                id: nuevoId,
                titulo,
                estado,
                categoria,
                busca,
                imagen: img || "imagenes/default.jpg"
            });
        }

        guardarPublicaciones();
        renderizarPublicaciones();

        document.getElementById("titulo").value = "";
        document.getElementById("estado").value = "";
        document.getElementById("categoria").value = "";
        document.getElementById("busca").value = "";
        document.getElementById("imagen").value = "";
    }
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
    document.getElementById("categoria").value = pub.categoria;
    document.getElementById("busca").value = pub.busca;

    editandoId = id;
}

/* ---------------------------
   INIT
----------------------------*/
renderizarPublicaciones();

document.getElementById("btnPublicar")
    .addEventListener("click", agregarPublicacion);