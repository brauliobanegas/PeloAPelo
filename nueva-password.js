document
.getElementById("formNuevaPassword")
.addEventListener("submit", async function(e){

    e.preventDefault();


    const nuevaPassword =
        document.getElementById("nuevaPassword").value;


    const repetirPassword =
        document.getElementById("repetirPassword").value;


    const mensaje =
        document.getElementById("mensaje");


    if(nuevaPassword !== repetirPassword){

        mensaje.textContent =
        "Las contraseñas no coinciden.";

        return;

    }


    const { error } =
        await supabaseClient.auth.updateUser({

            password: nuevaPassword

        });


    if(error){

        console.error(error);

        mensaje.textContent =
        "Error: " + error.message;

        return;

    }


    mensaje.textContent =
    "✅ Contraseña actualizada correctamente.";


    setTimeout(() => {

        window.location.href = "login.html";

    }, 2000);


});

document
.getElementById("mostrarNuevaPassword")
.addEventListener("click", () => {

    const campo =
    document.getElementById("nuevaPassword");

    campo.type =
    campo.type === "password"
    ? "text"
    : "password";

});


document
.getElementById("mostrarRepetirPassword")
.addEventListener("click", () => {

    const campo =
    document.getElementById("repetirPassword");

    campo.type =
    campo.type === "password"
    ? "text"
    : "password";

});