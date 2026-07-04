console.log("SCRIPT BASE OK");

let contenedor = document.getElementById("publicaciones");

/* ---------------------------
   DATOS FIJOS (SIN STORAGE)
----------------------------*/
let publicaciones = [
    {
        id: 1,
        titulo: "salamandra",
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
   RENDER SIMPLE
----------------------------*/
function renderizarPublicaciones() {

    contenedor.innerHTML = "";

    for (let p of publicaciones) {

        contenedor.innerHTML += `
        <div class="tarjeta">
            <img src="${p.imagen}" width="200">

            <h2>${p.titulo}</h2>

            <p>${p.estado}</p>
            <p>${p.busca}</p>

            <button onclick="alert('${p.titulo}')">
                Ver
            </button>
        </div>
        `;
    }
}

renderizarPublicaciones();