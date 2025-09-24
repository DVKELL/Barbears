const showRol = document.querySelector("#showRol");
const showNombre = document.querySelector("#showNombre");

const logUser = JSON.parse(localStorage.getItem("Data"));

//añadir validacion para que solo se ejecute cuando se esté en la url del cliente
document.addEventListener("DOMContentLoaded", () => {
    showRol.textContent = logUser.role;
    showNombre.textContent = logUser.nombre;
});
