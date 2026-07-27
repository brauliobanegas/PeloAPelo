document
.getElementById("formRecuperar")
.addEventListener("submit", async function(e){

    e.preventDefault();


    const email =
        document.getElementById("email").value;


    const mensaje =
        document.getElementById("mensaje");


    const { error } =
        await supabaseClient.auth
        .resetPasswordForEmail(email, {

            redirectTo:
            window.location.origin + "/nueva-password.html"

        });


    if(error){

        console.error(error);

        mensaje.textContent =
        "Error: " + error.message;

        return;

    }


    mensaje.textContent =
    "Revisá tu email. Te enviamos un enlace para cambiar la contraseña.";

});