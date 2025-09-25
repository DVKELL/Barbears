const showRol = document.querySelector("#showRol");
const showNombre = document.querySelector("#showNombre");

const userRol = JSON.parse(localStorage.getItem("Rol"));
const userName = JSON.parse(localStorage.getItem("Nombre"));

//añadir validacion para que solo se ejecute cuando se esté en la url del cliente
document.addEventListener("DOMContentLoaded", () => {
    showRol.textContent = userRol;
    showNombre.textContent = userName;
});
