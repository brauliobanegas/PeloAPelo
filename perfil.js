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


})();