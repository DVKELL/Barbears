const logBtn = document.querySelector("#logBtn");
const registerBtn = document.querySelector("#registerBtn");
const userPanel = document.querySelector("#userPanel");

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

    if (isLogged === "CLIENT" || isLogged === "BARBER") {
        registerBtn.style.display = "none";
    }

    if (isLogged) {
        userPanel.style.display = "flex";
        registerBtn.textContent = "Registrar usuarios";
    }

    logBtn.textContent = "Cerrar Sesión";
    return;
}
