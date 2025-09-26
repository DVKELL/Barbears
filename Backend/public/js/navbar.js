const logBtn = document.querySelector("#logBtn");

const isLogged = JSON.parse(localStorage.getItem("Rol"));

//DEFINICION DE EVENTO
document.addEventListener("DOMContentLoaded", () => {
    logged();
});

logBtn.addEventListener("click", (e) => {
    if (isLogged && logBtn.textContent === "Cerrar Sesión") {
        e.preventDefault();
        localStorage.removeItem("Id");
        localStorage.removeItem("Nombre");
        localStorage.removeItem("Rol");
        window.location.href = "/views/logout";
    }
});

//Toggle para validar si inició sesión o no
function logged() {
    if (!isLogged) {
        logBtn.textContent = "Iniciar Sesión";
        return;
    }

    logBtn.textContent = "Cerrar Sesión";
    return;
}
