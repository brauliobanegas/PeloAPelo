document
    .getElementById("formLogin")
    .addEventListener("submit", async function (e) {

        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const mensaje = document.getElementById("mensaje");

        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });

        if (error) {
            console.error(error);

            mensaje.textContent = error.message;

        return;
        }

        console.log("Sesión iniciada:", data.user);

        mensaje.textContent = "¡Bienvenido a TruequeAR!";
    });