(async () => {

    const { data } = await supabaseClient.auth.getSession();

    const formulario = document.getElementById("contenedorFormulario");
    const btnFormulario = document.getElementById("btnNuevaPublicacion");
   
    if (data.session) {

        btnFormulario.style.display = "inline-block";
        formulario.style.display = "none";
        document.getElementById("btnLogin").style.display = "none";
        document.getElementById("btnRegistro").style.display = "none";

        document.getElementById("btnPerfil").style.display = "inline-block";
        document.getElementById("btnCerrarSesion").style.display = "inline-block";

        btnFormulario.addEventListener("click", () => {

            if (formulario.style.display !== "block") {

                formulario.style.display = "block";
                btnFormulario.textContent = "➖ Ocultar formulario";

            } else {

                formulario.style.display = "none";
                btnFormulario.textContent = "➕ Publicar un objeto";

            }

});
    } else {

        btnFormulario.style.display = "none";
        formulario.style.display = "none";
        document.getElementById("btnLogin").style.display = "inline-block";
        document.getElementById("btnRegistro").style.display = "inline-block";

        document.getElementById("btnPerfil").style.display = "none";
        document.getElementById("btnCerrarSesion").style.display = "none";

    }

})();

async function cargarPublicacionesSupabase() {

    const { data, error } = await supabaseClient
        .from("publicaciones")
        .select("*")
        .order("id", { ascending: false });

    if (error) {
        console.error("Error cargando publicaciones:", error);
        return [];
    }

    return data;
}

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
   DATOS
----------------------------*/
let publicaciones = [];
let usuarioActualId = null;

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

    for (let p of publicaciones) {

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

                <button class="btn-ver" onclick="verPublicacion(${p.id})">
                    Ver
                </button>

            ${
                p.usuario_id === usuarioActualId
                ? `
                    <button class="btn-editar" onclick="editarPublicacion(${p.id})">
                        Editar
                    </button>

                    <button class="btn-eliminar" onclick="eliminarPublicacion(${p.id})">
                        Eliminar
                    </button>
                `
                : ""
            }

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
async function agregarPublicacion() {
    const btnPublicar = document.getElementById("btnPublicar");

    if (btnPublicar.disabled) return;

    btnPublicar.disabled = true;
    btnPublicar.textContent = "Publicando...";
    
    let titulo = document.getElementById("titulo").value;
    let estado = document.getElementById("estado").value;
    let categoria = document.getElementById("categoria").value;
    let busca = document.getElementById("busca").value;
    let descripcion = document.getElementById("descripcion").value;
    let archivo = document.getElementById("imagen").files[0];

    if (!titulo || !estado || !categoria || !busca) {
        alert("Completa todos los campos.");
        return;
    }

    if (archivo) {

    const nombreArchivo = Date.now() + "_" + archivo.name;

    const { error } = await supabaseClient.storage
        .from("publicaciones")
        .upload(nombreArchivo, archivo);

    if (error) {
        console.error("Error subiendo imagen:", error);
        alert("No se pudo subir la imagen.");
        return;
    }

    const { data } = supabaseClient.storage
        .from("publicaciones")
        .getPublicUrl(nombreArchivo);

    guardar(data.publicUrl);

} else {

    guardar("");

}

    async function guardar(img) {

        if (editandoId !== null) {

    const datosActualizar = {
        titulo,
        estado,
        categoria,
        busca,
        descripcion
    };

    if (img) {
        datosActualizar.imagen = img;
    }

    const { error } = await supabaseClient
        .from("publicaciones")
        .update(datosActualizar)
        .eq("id", editandoId);;
        
    if (error) {
        console.error("Error actualizando publicación:", error);
        alert("No se pudo actualizar la publicación.");
        btnPublicar.disabled = false;
        btnPublicar.textContent = "Publicar";
        return;
    }

    editandoId = null;

        } else {

            usuarioActualId = await obtenerUsuarioActual();

            if (!usuarioActualId) {
                alert("No hay usuario autenticado.");
                btnPublicar.disabled = false;
                btnPublicar.textContent = "Publicar";
                return;
            }

            const { error } = await supabaseClient
                .from("publicaciones")
                .insert({
                    usuario_id: usuarioActualId,
                    titulo,
                    estado,
                    categoria,
                    busca,
                    descripcion,
                    imagen: img || "imagenes/default.jpg"
                });

            if (error) {
                console.error("Error guardando publicación:", error);
                alert("No se pudo guardar la publicación.");
                btnPublicar.disabled = false;
                btnPublicar.textContent = "Publicar";
                return;
            }
                  
        }

        publicaciones = await cargarPublicacionesSupabase();
        renderizarPublicaciones();
        document.getElementById("contenedorFormulario").style.display = "none";
        document.getElementById("btnNuevaPublicacion").textContent = "➕ Publicar un objeto";
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
        document.getElementById("descripcion").value = "";
        document.getElementById("imagen").value = "";
        btnPublicar.disabled = false;
        btnPublicar.textContent = "Publicar";
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
async function eliminarPublicacion(id) {

    const confirmar = confirm("¿Seguro que querés eliminar esta publicación?");

    if (!confirmar) return;

    const { error } = await supabaseClient
        .from("publicaciones")
        .delete()
        .eq("id", id);
    
    if (error) {
        console.error("Error eliminando publicación:", error);
        alert("No se pudo eliminar la publicación.");
        return;
    }

    publicaciones = await cargarPublicacionesSupabase();
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
    document.getElementById("descripcion").value = pub.descripcion || "";

    editandoId = id;
}

/* ---------------------------
   INIT
----------------------------*/
(async () => {

    usuarioActualId = await obtenerUsuarioActual();

    publicaciones = await cargarPublicacionesSupabase();

    renderizarPublicaciones();

})();

document.getElementById("btnPublicar")
    .addEventListener("click", agregarPublicacion);

document.getElementById("btnLogin")
    .addEventListener("click", () => {

    window.location.href = "login.html";

});
document.getElementById("btnRegistro")
.addEventListener("click", () => {

    window.location.href = "registro.html";

});

document.getElementById("btnPerfil")
.addEventListener("click", () => {

    window.location.href = "perfil.html";

});


document
    .getElementById("btnCerrarSesion")
    .addEventListener("click", async () => {

        const { error } = await supabaseClient.auth.signOut();

        if (error) {
            console.error(error);
            return;
        }

        window.location.href = "login.html";

    });

    async function obtenerUsuarioActual() {

    const { data: { session } } = await supabaseClient.auth.getSession();

    if (!session) {
        return null;
    }

       const { data, error } = await supabaseClient
        .from("usuarios")
        .select("id")
        .eq("auth_id", session.user.id)
        .single();

    if (error) {
        console.error("Error obteniendo usuario:", error);
        return null;
    }

    return data.id;
}
