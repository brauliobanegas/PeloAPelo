console.log("SCRIPT BASE OK");

let contenedor = document.getElementById("publicaciones");

/* ---------------------------
   BUSCADOR + FILTRO
----------------------------*/
let inputBuscador = document.getElementById("buscador");
let filtroCategoria = document.getElementById("filtroCategoria");
let chips = document.querySelectorAll(".chip");

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

chips.forEach(chip => {

    chip.addEventListener("click", function () {

        chips.forEach(c => c.classList.remove("activo"));

        this.classList.add("activo");

        const categoria = this.dataset.categoria;

        filtroCategoria.value = categoria;

        renderizarPublicaciones(
            inputBuscador?.value || "",
            categoria
        );

    });

});

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

    if (publicaciones.length === 0) {
    contenedor.innerHTML = `
        <div style="
            width:100%;
            text-align:center;
            padding:40px 20px;
            color:#666;
        ">
            <h3 style="margin-bottom:8px;">No hay publicaciones todavía</h3>
            <p style="font-size:13px;">Sé el primero en intercambiar algo 👍</p>
        </div>
    `;
    return;
}

    if (publicaciones.length === 0) {
    contenedor.innerHTML = `
        <p style="
            text-align:center;
            color:#777;
            width:100%;
            padding:30px;
            font-size:14px;
        ">
            No hay publicaciones todavía. Sé el primero en publicar 👍
        </p>
    `;
    return;
}

    for (let p of [...publicaciones].reverse()) {

        if (filtro && !p.titulo.toLowerCase().includes(filtro.toLowerCase())) continue;

        if (categoria && p.categoria !== categoria) continue;

        contenedor.innerHTML += `
        <div class="tarjeta">
            <img src="${p.imagen}" width="200">

            <span class="badge ${p.estado.toLowerCase()}">${p.estado}</span>
            <h2>${p.titulo}</h2>

            <p><strong>Estado:</strong> ${p.estado}</p>
            <p><strong>Categoría:</strong> ${p.categoria}</p>
            <p><strong>Busca:</strong> ${p.busca}</p>

            <div class="acciones">
            <button class="btn-ver" onclick="verPublicacion(${p.id})">Ver</button>
            <button class="btn-editar" onclick="editarPublicacion(${p.id})">Editar</button>
            <button class="btn-eliminar" onclick="eliminarPublicacion(${p.id})">Eliminar</button>
            </div>
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
        contenedor.style.transition = "opacity 0.15s ease";
        contenedor.style.opacity = "0.5";

        setTimeout(() => {
            contenedor.style.opacity = "1";
        }, 120);

        contenedor.style.opacity = "0.6";

        setTimeout(() => {
            contenedor.style.opacity = "1";
        }, 150);

        document.getElementById("titulo").value = "";
        document.getElementById("estado").value = "";
        document.getElementById("categoria").value = "";
        document.getElementById("busca").value = "";
        document.getElementById("imagen").value = "";
    }
}

    function verPublicacion(id) {

        let pub = publicaciones.find(p => p.id === id);

        if (!pub) return;

        document.getElementById("modalImagen").src = pub.imagen;
        document.getElementById("modalTitulo").textContent = pub.titulo;
        document.getElementById("modalEstado").textContent = "Estado: " + pub.estado;
        document.getElementById("modalCategoria").textContent = "Categoría: " + pub.categoria;
        document.getElementById("modalBusca").textContent = "Busca: " + pub.busca;

        document.getElementById("modal").style.display = "flex";
}

document.getElementById("cerrarModal").addEventListener("click", function () {
    document.getElementById("modal").style.display = "none";
});

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