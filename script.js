(async () => {

    const { data } = await supabaseClient.auth.getSession();

    const formulario = document.getElementById("contenedorFormulario");
    const btnFormulario = document.getElementById("btnNuevaPublicacion");
   
    if (data.session) {

        btnFormulario.style.display = "block";
        formulario.style.display = "none";
        document.getElementById("btnLogin").style.display = "none";
        document.getElementById("btnRegistro").style.display = "none";

        document.getElementById("btnPerfil").style.display = "inline-block";
        document.getElementById("btnCerrarSesion").style.display = "inline-block";

        btnFormulario.addEventListener("click", () => {

            if (formulario.style.display !== "block") {

                formulario.style.display = "block";
                btnFormulario.textContent = "➖ Ocultar formulario";
                formulario.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

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
        document.getElementById("btnCancelarEdicion")
            .addEventListener("click", cancelarEdicion);

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

    const hace30Dias = new Date();

    hace30Dias.setDate(hace30Dias.getDate() - 30);

    publicaciones = data.filter(pub => {

        return new Date(pub.created_at) >= hace30Dias;

    });

    return publicaciones;
}

async function cargarSolicitudesPendientes() {

    const { data: solicitudes, error } = await supabaseClient
        .from("solicitudes_intercambio")
        .select("publicacion_id, estado")
        .eq("estado", "pendiente");

    if (error) {

        console.error("Error cargando solicitudes:", error);
        return;

    }

    estadosSolicitudes = {};

    solicitudes.forEach(solicitud => {

        estadosSolicitudes[solicitud.publicacion_id] = solicitud.estado;

    });

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
let estadosSolicitudes = {};

const btnAyuda = document.getElementById("btnAyuda");
const modalAyuda = document.getElementById("modalAyuda");
const cerrarModalAyuda = document.getElementById("cerrarModalAyuda");
const btnEnviarAyuda = document.getElementById("btnEnviarAyuda");

const toast = document.getElementById("toast");

function mostrarToast(mensaje){

    toast.textContent = mensaje;

    toast.classList.add("mostrar");

    setTimeout(() => {

        toast.classList.remove("mostrar");

    }, 2500);

}

btnAyuda.addEventListener("click", () => {
    modalAyuda.style.display = "flex";
});

cerrarModalAyuda.addEventListener("click", () => {
    modalAyuda.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modalAyuda) {
        modalAyuda.style.display = "none";
    }
});

btnEnviarAyuda.addEventListener("click", enviarMensajeAyuda);

async function enviarMensajeAyuda() {
    btnEnviarAyuda.disabled = true;
    btnEnviarAyuda.textContent = "Enviando...";

    const asunto = document.getElementById("asuntoAyuda").value;
    const mensaje = document.getElementById("mensajeAyuda").value;

    const { data } = await supabaseClient.auth.getUser();

    const usuario = data.user;

    const { error } = await supabaseClient
        .from("mensajes_contacto")
        .insert([
            {
                usuario_id: usuario.id,
                asunto: asunto,
                mensaje: mensaje
            }
        ]);

    if (error) {

        console.error(error);

        alert("Ocurrió un error al enviar el mensaje.");

        return;

    }

    
    mostrarToast("✅ Mensaje enviado correctamente");

    document.getElementById("asuntoAyuda").value = "";
    document.getElementById("mensajeAyuda").value = "";
    modalAyuda.style.display = "none";
    btnEnviarAyuda.disabled = false;
    btnEnviarAyuda.textContent = "Enviar mensaje";
}

/* ---------------------------
   RENDER
----------------------------*/
function formatoFecha(fecha) {

    const f = new Date(fecha);

    return f.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

}

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
        <div
            class="tarjeta ${editandoId === p.id ? "tarjeta-editando" : ""}"
            onclick="verPublicacion(${p.id})"
        >

            ${editandoId === p.id ? `
                <div class="etiqueta-editando">
                ✏️ EDITANDO
                </div>
            ` : ""}
            <img
                src="${p.imagen || 'imagenes/logo.png'}"
                class="${!p.imagen || p.imagen.includes('logo.png') ? 'logo-publicacion' : ''}"
            >

            <span class="badge ${p.estado.toLowerCase()}">${p.estado}</span>
            <h2>${p.titulo}</h2>

            <p><strong>Estado:</strong> ${p.estado}</p>
            <p><strong>Categoría:</strong> ${p.categoria}</p>
            <p><strong>Busca:</strong> ${p.busca}</p>

            <p class="fecha-publicacion">
                Publicado: ${formatoFecha(p.created_at)}
            </p>

            ${
                estadosSolicitudes[p.id] === "pendiente"
                ? `
                    <p class="estado-solicitud-tarjeta">
                        Solicitud pendiente
                    </p>
                `
                : ""
            }
            
            <div class="acciones">

          
    <button
        class="btn-ver"
        onclick="event.stopPropagation(); verPublicacion(${p.id})">
            Ver
    </button>

    ${
        p.usuario_id === usuarioActualId
        ? `
            ${
                editandoId === p.id
                ? `
                    <button class="btn-editar editando" disabled>
                        ✏️ Editando
                    </button>

                    <button class="btn-eliminar" disabled>
                        Eliminar
                    </button>
                `
                : `
                    <button
                        class="btn-editar"
                        onclick="event.stopPropagation(); editarPublicacion(${p.id})"
                        ${editandoId !== null ? "disabled" : ""}
                    >
                        Editar
                    </button>

                    <button
                        class="btn-eliminar"
                        onclick="event.stopPropagation(); eliminarPublicacion(${p.id})"
                        ${editandoId !== null ? "disabled" : ""}
                    >
                        Eliminar
                    </button>
                `
            }
        `
        : ""
    }

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
                    imagen: img || "imagenes/logo.png"
                });

            if (error) {
                console.error("Error guardando publicación:", error);
                alert("No se pudo guardar la publicación.");
                btnPublicar.disabled = false;
                btnPublicar.textContent = "Publicar";
                return;
            }
                  
        }
renderizarPublicaciones();

btnPublicar.disabled = false;
btnPublicar.textContent = "Publicar";
       
}

        renderizarPublicaciones();
        document.getElementById("contenedorFormulario").style.display = "none";
        document.getElementById("btnNuevaPublicacion").textContent = "➕ Publicar un objeto";
        document.getElementById("btnPublicar").textContent =
            "Publicar";
        document.getElementById("tituloFormulario").textContent =
            "Nueva publicación";
        document.getElementById("tituloFormulario")
            .classList.remove("editando");
        document.getElementById("tituloFormulario").textContent =
            "Nueva publicación";
        document.getElementById("tituloFormulario")
            .classList.remove("editando");

        document.getElementById("tituloFormulario")
            .classList.remove("editando");
        contenedor.style.transition = "opacity 0.15s ease";
        contenedor.style.opacity = "0.5";
        document.getElementById("btnCancelarEdicion").style.display =
            "none";

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


    let publicacionSeleccionada = null;

    function verPublicacion(id) {

        let pub = publicaciones.find(p => p.id === id);

        publicacionSeleccionada = pub;

        if (!pub) return;

        document.getElementById("modalImagen").src = pub.imagen;
        document.getElementById("modalTitulo").textContent = pub.titulo;
        document.getElementById("modalEstado").textContent = "Estado: " + pub.estado;
        document.getElementById("modalCategoria").textContent = "Categoría: " + pub.categoria;
        document.getElementById("modalBusca").textContent = "Busca: " + pub.busca;
        document.getElementById("modalDescripcion").textContent =
            "Descripción: " + (pub.descripcion || "Sin descripción");

        document.getElementById("modalFecha").textContent =
            "📅 Publicado: " + formatoFecha(pub.created_at);

        document.getElementById("modal").style.display = "flex";

        const btnCambiar = document.getElementById("btnCambiar");

        if (pub.usuario_id === usuarioActualId) {

            btnCambiar.style.display = "none";

        } else {

            btnCambiar.style.display = "block";

            verificarSolicitudPendiente(pub.id);
        }
    } 

async function verificarSolicitudPendiente(publicacionId){

    const { data } = await supabaseClient.auth.getSession();

    if(!data.session) return;

    const usuarioAuth = data.session.user;

    const { data: usuario } = await supabaseClient
        .from("usuarios")
        .select("id")
        .eq("auth_id", usuarioAuth.id)
        .single();


    const { data: solicitud } = await supabaseClient
        .from("solicitudes_intercambio")
        .select("id, estado")
        .eq("publicacion_id", publicacionId)
        .eq("usuario_solicitante_id", usuario.id)
        .eq("estado", "pendiente")
        .maybeSingle();


    const btnCambiar = document.getElementById("btnCambiar");


    const estadoSolicitud =
        document.getElementById("modalEstadoSolicitud");


    if(solicitud){

        estadoSolicitud.textContent = "Solicitud pendiente";

        btnCambiar.style.display = "none";

    }else{

        estadoSolicitud.textContent = "";

        btnCambiar.style.display = "block";
        btnCambiar.disabled = false;
        btnCambiar.textContent = "Te lo cambio";

        btnCambiar.onclick = solicitarIntercambio;

    }

}

async function solicitarIntercambio() {

    const confirmar = confirm(
`Al enviar esta solicitud, si el propietario la acepta, tus datos de contacto que registraste, sean:
• Tu nombre
• Tu correo electrónico
• Tu número de teléfono
serán compartidos con la otra parte.
Del mismo modo, vos recibirás esos mismos datos del propietario para que puedan coordinar el intercambio.

¿Deseás continuar?`
    );

    if (!confirmar) {

        return;

    }

    const { data } = await supabaseClient.auth.getSession();

    const usuarioAuth = data.session.user;

    const { data: usuario } = await supabaseClient
        .from("usuarios")
        .select("id")
        .eq("auth_id", usuarioAuth.id)
        .single();

    const { error } = await supabaseClient
        .from("solicitudes_intercambio")
        .insert([
            {
                publicacion_id: publicacionSeleccionada.id,
                usuario_solicitante_id: usuario.id,
                usuario_dueno_id: publicacionSeleccionada.usuario_id
            }
        ]);

    if (error) {

        console.error(error);

        alert("Error al enviar la solicitud.");

        return;

    }

    mostrarToast("✅ Solicitud enviada");

    const btnCambiar = document.getElementById("btnCambiar");

    btnCambiar.textContent = "Esperando respuesta";
    btnCambiar.disabled = true;

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

    document.getElementById("modal").style.display = "none";

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
    renderizarPublicaciones();
    document.getElementById("contenedorFormulario").style.display = "block";
    document.getElementById("contenedorFormulario").scrollIntoView({
    behavior: "smooth",
    block: "start"
    });
    document.getElementById("tituloFormulario").textContent =
        "Editando publicación";

    document.getElementById("btnNuevaPublicacion").textContent =
        "➖ Ocultar formulario";
    
    document.getElementById("btnPublicar").textContent =
        "💾 Guardar cambios";

    document.getElementById("btnPublicar")
        .classList.add("editando");

    document.getElementById("btnCancelarEdicion").style.display =
        "block";

    document.getElementById("tituloFormulario").textContent =
        "Editando publicación";

    document.getElementById("tituloFormulario")
        .classList.add("editando");
}

/* ---------------------------
   INIT
----------------------------*/
(async () => {

    usuarioActualId = await obtenerUsuarioActual();

    await cargarSolicitudesPendientes();

    publicaciones = await cargarPublicacionesSupabase();

    renderizarPublicaciones();

})();

document.getElementById("btnPublicar")
    .addEventListener("click", agregarPublicacion);

document.getElementById("btnCancelarEdicion")
    .addEventListener("click", cancelarEdicion);

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

function cancelarEdicion() {

    editandoId = null;

    document.getElementById("titulo").value = "";
    document.getElementById("estado").value = "";
    document.getElementById("categoria").value = "";
    document.getElementById("busca").value = "";
    document.getElementById("descripcion").value = "";
    document.getElementById("imagen").value = "";

    document.getElementById("contenedorFormulario").style.display =
        "none";

    document.getElementById("btnNuevaPublicacion").textContent =
        "➕ Publicar un objeto";

    document.getElementById("btnPublicar").textContent =
        "Publicar";

    document.getElementById("btnPublicar")
        .classList.remove("editando");

    document.getElementById("btnCancelarEdicion").style.display =
        "none";

    document.getElementById("tituloFormulario").textContent =
        "Nueva publicación";

    renderizarPublicaciones();

}