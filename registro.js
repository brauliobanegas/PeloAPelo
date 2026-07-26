document
    .getElementById("formRegistro")
    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
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
                    apellido: apellido,
                    email: email,
                    telefono: telefono
                }
]);

        if (errorPerfil) {
            console.error("Error al guardar el perfil:", errorPerfil);

            mensaje.textContent =
            "La cuenta fue creada, pero ocurrió un problema al guardar el perfil. Si el problema persiste, contactá al administrador.";

        return;
}

        mensaje.textContent = "✅ Cuenta creada correctamente. Revisá tu email para confirmar tu cuenta.";

        console.log("Usuario Auth:", data);

    });

document.getElementById("aceptoTerminos")
.addEventListener("change", function(){

    document.getElementById("btnRegistro").disabled = !this.checked;

});

const btnMostrarPassword = document.getElementById("mostrarPassword");
const campoPassword = document.getElementById("password");

btnMostrarPassword.addEventListener("mousedown", () => {
    campoPassword.type = "text";
});

btnMostrarPassword.addEventListener("mouseup", () => {
    campoPassword.type = "password";
});

btnMostrarPassword.addEventListener("mouseleave", () => {
    campoPassword.type = "password";
});