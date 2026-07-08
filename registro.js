document
    .getElementById("formRegistro")
    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const telefono = document.getElementById("telefono").value;

        const mensaje = document.getElementById("mensaje");

        const { data, error } = await supabaseClient.auth.signUp({
            email: email,
            password: password
        });

        if (error) {
            console.error(error);
            mensaje.textContent = "Error: " + error.message;
            return;
        }

        const { error: errorPerfil } = await supabaseClient
            .from("usuarios")
            .insert([
                {
                    auth_id: data.user.id,
                    nombre: nombre,
                    email: email,
                    telefono: telefono
                }
]);

        if (errorPerfil) {
            console.error(errorPerfil);
            mensaje.textContent = "Usuario creado, pero error guardando perfil.";
            return;
        }

        mensaje.textContent = "Usuario registrado correctamente.";

        console.log("Usuario Auth:", data);

    });