(async () => {

    const { data } = await supabaseClient.auth.getSession();

    if (!data.session) {

        window.location.href = "login.html";
        return;

    }


    const usuarioAuth = data.session.user;


    document.getElementById("emailUsuario").textContent =
        usuarioAuth.email;


    const { data: usuario, error } = await supabaseClient
        .from("usuarios")
        .select("*")
        .eq("auth_id", usuarioAuth.id)
        .single();


    if (error) {

        console.error("Error obteniendo perfil:", error);
        return;

    }


    document.getElementById("nombreUsuario").textContent =
        usuario.nombre;


    document.getElementById("telefonoUsuario").textContent =
        usuario.telefono || "No cargado";

const { data: misPublicaciones, error: errorPublicaciones } =
        await supabaseClient
            .from("publicaciones")
            .select("*")
            .eq("usuario_id", usuario.id);


if (errorPublicaciones) {

    console.error("Error cargando publicaciones:", errorPublicaciones);
    return;

}


const contenedorMisPublicaciones =
        document.getElementById("misPublicaciones");


if (misPublicaciones.length === 0) {

    contenedorMisPublicaciones.textContent =
        "Todavía no tenés publicaciones.";

} else {

    contenedorMisPublicaciones.innerHTML = "";

    misPublicaciones.forEach(pub => {

        contenedorMisPublicaciones.innerHTML += `

            <div class="tarjeta-perfil">

                
                <img 
                    src="${pub.imagen || 'imagenes/logo.png'}"
                    onclick="abrirImagenPerfil('${pub.imagen}')"
                >

                <div>

                    <h4>${pub.titulo}</h4>

                    <p>Estado: ${pub.estado}</p>

                    <p>Categoría: ${pub.categoria}</p>

                </div>

            </div>

        `;

    });

}

const { data: solicitudes, error: errorSolicitudes } =
    await supabaseClient
       .from("solicitudes_intercambio")
        .select(`
            *,
            resultado_usuario_dueno,
            resultado_usuario_solicitante,
            publicaciones (
                titulo,
                imagen
            )
        `)
        .or(
            `usuario_dueno_id.eq.${usuario.id},usuario_solicitante_id.eq.${usuario.id}`
        );


const contenedorSolicitudes =
    document.getElementById("solicitudesIntercambio");


if (errorSolicitudes) {

    console.error("Error cargando solicitudes:", errorSolicitudes);
    contenedorSolicitudes.textContent =
        "Error cargando solicitudes.";

} else if (solicitudes.length === 0) {

    contenedorSolicitudes.textContent =
        "No tenés solicitudes pendientes.";

} else {

    contenedorSolicitudes.innerHTML = "";

    solicitudes.forEach(sol => {

        const soyDueno = sol.usuario_dueno_id === usuario.id;

        contenedorSolicitudes.innerHTML += `

            <div>

                <p>
                    ${sol.publicaciones.titulo}
                </p>

                <img 
                    src="${sol.publicaciones.imagen}"
                    width="80"
                >

                
                ${
                    sol.estado === "pendiente" && soyDueno
                    ?
                    `
                        <p class="estado-solicitud-tarjeta pendiente">
                            Esperando respuesta
                        </p>

                        <div class="acciones">
                            <button class="btn-principal"
                                onclick="aceptarSolicitud(${sol.id})">
                                Aceptar
                            </button>

                            <button class="btn-secundario"
                                onclick="rechazarSolicitud(${sol.id})">
                                Rechazar
                            </button>
                        </div>
                    `
                    :
                    sol.estado === "pendiente" && soyDueno
                    ?
                    `
                    <p class="estado-solicitud-tarjeta pendiente">
                        Esperando respuesta
                    </p>

                    <div class="acciones">
                        <button class="btn-principal"
                            onclick="aceptarSolicitud(${sol.id})">
                            Aceptar
                        </button>

                        <button class="btn-secundario"
                            onclick="rechazarSolicitud(${sol.id})">
                            Rechazar
                        </button>
                    </div>
                    `
                    :
                    sol.estado === "pendiente" && !soyDueno
                    ?
                    `
                    <p class="estado-solicitud-tarjeta pendiente">
                        Esperando respuesta
                    </p>
                    `
                    :
                    sol.estado === "aceptado"
                    ?
                    `
                    <p class="estado-solicitud-tarjeta aceptado">
                        Intercambio aceptado
                    </p>

                    <div class="acciones">

                        <button
                            class="btn-principal"
                            onclick="mostrarContacto(${sol.id})">
                            Mostrar contacto
                        </button>

                        ${
                            (
                                (soyDueno && !sol.resultado_usuario_dueno) ||
                                (!soyDueno && !sol.resultado_usuario_solicitante)
                            )
                            ?
                            `
                                <button
                                    class="btn-principal"
                                    onclick="marcarIntercambio(${sol.id}, 'exitoso')">
                                    Intercambio exitoso
                                </button>

                                <button
                                    class="btn-secundario"
                                    onclick="marcarIntercambio(${sol.id}, 'fallo')">
                                    Falló el intercambio
                                </button>
                            `
                            :
                            ""
                        }

                    </div>
                    `
                    :
                    `
                    <p class="estado-solicitud-tarjeta rechazado">
                        Intercambio rechazado
                    </p>
                    `
                }

            </div>

        `;

    });

}

})();

document.getElementById("btnVolverInicio")
.addEventListener("click", () => {

    window.location.href = "index.html";

});

document.getElementById("btnEditarPerfil")
.addEventListener("click", () => {

    document.getElementById("nombreUsuario").style.display = "none";
    document.getElementById("telefonoUsuario").style.display = "none";

    document.getElementById("inputNombre").style.display = "block";
    document.getElementById("inputTelefono").style.display = "block";

    document.getElementById("inputNombre").value =
        document.getElementById("nombreUsuario").textContent;

    document.getElementById("inputTelefono").value =
        document.getElementById("telefonoUsuario").textContent;


    document.getElementById("btnEditarPerfil").style.display = "none";
    document.getElementById("btnGuardarPerfil").style.display = "block";
    document.getElementById("btnCancelarPerfil").style.display = "block";

});

document.getElementById("btnCancelarPerfil")
.addEventListener("click", () => {

    document.getElementById("nombreUsuario").style.display = "block";
    document.getElementById("telefonoUsuario").style.display = "block";

    document.getElementById("inputNombre").style.display = "none";
    document.getElementById("inputTelefono").style.display = "none";


    document.getElementById("btnEditarPerfil").style.display = "block";
    document.getElementById("btnGuardarPerfil").style.display = "none";
    document.getElementById("btnCancelarPerfil").style.display = "none";

});

function abrirImagenPerfil(imagen){

    const modal = document.getElementById("modalImagenPerfil");

    const img = document.getElementById("imagenPerfilGrande");

    img.src = imagen;

    modal.style.display = "flex";

}


document.getElementById("cerrarImagenPerfil")
.addEventListener("click", () => {

    document.getElementById("modalImagenPerfil")
    .style.display = "none";

});


document.getElementById("btnGuardarPerfil")
.addEventListener("click", async () => {

    const nuevoNombre =
        document.getElementById("inputNombre").value;

    const nuevoTelefono =
        document.getElementById("inputTelefono").value;


    const { data } = await supabaseClient.auth.getSession();

    const usuarioAuth = data.session.user;

    
    const { data: actualizado, error } = await supabaseClient
        .from("usuarios")
        .update({
            nombre: nuevoNombre,
            telefono: nuevoTelefono
        })
        .eq("auth_id", usuarioAuth.id)
        .select();
     


    if (error) {

        console.error("Error actualizando perfil:", error);

        alert("No se pudieron guardar los cambios.");

        return;

    }


    document.getElementById("nombreUsuario").textContent =
        nuevoNombre;

    document.getElementById("telefonoUsuario").textContent =
        nuevoTelefono;


    document.getElementById("nombreUsuario").style.display = "block";
    document.getElementById("telefonoUsuario").style.display = "block";

    document.getElementById("inputNombre").style.display = "none";
    document.getElementById("inputTelefono").style.display = "none";


    document.getElementById("btnEditarPerfil").style.display = "block";
    document.getElementById("btnGuardarPerfil").style.display = "none";
    document.getElementById("btnCancelarPerfil").style.display = "none";


    mostrarToast("✅ Perfil actualizado correctamente");

});

function mostrarToast(mensaje){

    const toast = document.getElementById("toast");

    toast.textContent = mensaje;

    toast.classList.add("mostrar");

    setTimeout(() => {

        toast.classList.remove("mostrar");

    }, 2500);

}

async function aceptarSolicitud(id){

    const confirmar = confirm(
`Al aceptar esta solicitud de intercambio, autorizás que la otra parte pueda ver tus datos de contacto registrados:
• Nombre
• Correo electrónico
• Teléfono
Del mismo modo, vos también podrás ver los datos de la otra persona para coordinar el intercambio.

¿Deseás continuar?`
        );

        if (!confirmar) {
            return;
        }

    const { error } = await supabaseClient
        .from("solicitudes_intercambio")
       .update({
            estado: "aceptado",
            fecha_aceptacion: new Date()
        })
        .eq("id", id);

    const { data: solicitud } = await supabaseClient
        .from("solicitudes_intercambio")
        .select(`
            usuario_dueno_id,
            usuario_solicitante_id,
            publicacion_id,
            resultado_usuario_dueno,
            resultado_usuario_solicitante
        `)
        .eq("id", id)
        .single();

    await supabaseClient
        .from("publicaciones")
        .update({
            estado_intercambio: "aceptado"
        })
        .eq("id", solicitud.publicacion_id);    

    if(error){

        console.error(error);

        alert("No se pudo aceptar la solicitud.");

        return;

    }


    alert("Solicitud aceptada");

    location.reload();

}

async function rechazarSolicitud(id){

    const { error } = await supabaseClient
        .from("solicitudes_intercambio")
        .update({
            estado: "rechazado"
        })
        .eq("id", id);

    const { data: solicitudActualizada } = await supabaseClient
        .from("solicitudes_intercambio")
        .select(`
            resultado_usuario_dueno,
            resultado_usuario_solicitante,
            publicacion_id
        `)
        .eq("id", id)
        .single();

    if (
        solicitudActualizada.resultado_usuario_dueno &&
        solicitudActualizada.resultado_usuario_solicitante
    ) {

        const ambosExitosos =
            solicitudActualizada.resultado_usuario_dueno === "exitoso" &&
            solicitudActualizada.resultado_usuario_solicitante === "exitoso";

        await supabaseClient
            .from("publicaciones")
            .update({
                estado_intercambio: ambosExitosos ? "finalizado" : "disponible"
            })
            .eq("id", solicitudActualizada.publicacion_id);

    }

        if(error){

        console.error(error);

        alert("No se pudo rechazar la solicitud.");

        return;

    }


    alert("Solicitud rechazada");

    location.reload();

}

async function mostrarContacto(id){

        const confirmar = confirm(
`Al mostrar los datos de contacto que resgistraron, ambas partes podrán ver:
• Nombre
• Correo electrónico
• Teléfono
Esto les permitirá coordinar el intercambio.

¿Deseás continuar?`
    );

    if (!confirmar) {
        return;
    }

    const { data: solicitud, error } = await supabaseClient
        .from("solicitudes_intercambio")
        .select("*")
        .eq("id", id)
        .single();


    if(error){

        console.error(error);

        return;

    }


   
    const { data: sesion } = await supabaseClient.auth.getSession();

    const usuarioAuth = sesion.session.user;


    const { data: miUsuario } = await supabaseClient
        .from("usuarios")
        .select("id")
        .eq("auth_id", usuarioAuth.id)
        .single();


    const otroUsuarioId =
        solicitud.usuario_solicitante_id === miUsuario.id
        ? solicitud.usuario_dueno_id
        : solicitud.usuario_solicitante_id;

    const { data: contacto, error: errorContacto } =
        await supabaseClient
            .from("usuarios")
            .select("nombre, telefono, email")
            .eq("id", otroUsuarioId)
            .single();


    if(errorContacto){

        console.error(errorContacto);

        return;

    }


    document.getElementById("contactoNombre").textContent =
        "Nombre: " + contacto.nombre;

    document.getElementById("contactoTelefono").textContent =
        "Teléfono: " + (contacto.telefono || "No informado");

    document.getElementById("contactoEmail").textContent =
        "Email: " + contacto.email;

    document.getElementById("modalContacto").style.display = "flex";

}

document.getElementById("cerrarModalContacto")
.addEventListener("click", () => {

    document.getElementById("modalContacto")
    .style.display = "none";

});

async function marcarIntercambio(id, resultado){

    const { data } = await supabaseClient.auth.getSession();

    const usuarioAuth = data.session.user;

    const { data: miUsuario } = await supabaseClient
        .from("usuarios")
        .select("id")
        .eq("auth_id", usuarioAuth.id)
        .single();

    const { data: solicitud } = await supabaseClient
        .from("solicitudes_intercambio")
        .select("usuario_dueno_id, usuario_solicitante_id")
        .eq("id", id)
        .single();

    const campo =
        miUsuario.id === solicitud.usuario_dueno_id
        ? "resultado_usuario_dueno"
        : "resultado_usuario_solicitante";

    const { data: actualizada, error } = await supabaseClient
        .from("solicitudes_intercambio")
        .update({
            [campo]: resultado
        })
        .eq("id", id)
        .select();
    
  
    if(error){

        console.error(error);

        alert("No se pudo registrar el resultado.");

        return;

    }

    
    const { data: solicitudActualizada } = await supabaseClient
        .from("solicitudes_intercambio")
        .select(`
            resultado_usuario_dueno,
            resultado_usuario_solicitante,
            publicacion_id
        `)
        .eq("id", id)
        .single();
    
    if(
        solicitudActualizada.resultado_usuario_dueno &&
        solicitudActualizada.resultado_usuario_solicitante
    ){

        const estadoFinal =
            solicitudActualizada.resultado_usuario_dueno === "exitoso" &&
            solicitudActualizada.resultado_usuario_solicitante === "exitoso"
            ? "finalizado"
            : "disponible";

       
        await supabaseClient
            .from("publicaciones")
            .update({
                estado_intercambio: estadoFinal
            })
            .eq("id", solicitudActualizada.publicacion_id);

    }

    alert("Resultado registrado correctamente.");

    location.reload();

}
