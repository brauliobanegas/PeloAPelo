(async () => {

    const { data } = await supabaseClient.auth.getSession();

    if (!data.session) {

        window.location.href = "login.html";
        return;

    }

    document.getElementById("emailUsuario").textContent =
        data.session.user.email;

})();