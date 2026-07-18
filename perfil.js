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