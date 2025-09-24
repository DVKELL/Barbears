const logBtn = document.querySelector("#logBtn");

const isLogged = JSON.parse(localStorage.getItem("Data"));

//DEFINICION DE EVENTO
document.addEventListener("DOMContentLoaded", (e) => {
    logged();
});

logBtn.addEventListener("click", () => {
    if (isLogged && logBtn.textContent === "Cerrar Sesión") {
        localStorage.removeItem("Data");
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
