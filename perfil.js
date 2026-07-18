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

    console.log("Auth ID actual:", usuarioAuth.id);


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