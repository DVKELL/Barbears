const loginForm = document.querySelector("#loginForm");

const password = document.querySelector("#password");
const email = document.querySelector("#email");

const url = "http://localhost:4000/api/v1/auth/login";

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    login();
});

function login() {
    const content = {
        email: email.value,
        password: password.value.trim(),
    };

    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(content),
    })
        .then((res) => {
            console.log("RESPUESTA: ", res);
            if (!res.ok) {
                throw new Error("Error en la solicitud");
            }

            return res.json();
        })
        .then((data) => {
            console.log("RESPUESTA: ", data);

            const userData = {
                nombre: data.userLogged.user.fullName,
                role: data.userLogged.user.role,
                id: data.userLogged.user._id,
            };

                localStorage.setItem("Rol", JSON.stringify(userData.role));
                localStorage.setItem("Nombre", JSON.stringify(userData.nombre));
                localStorage.setItem("Id", JSON.stringify(userData.id));
            
            setTimeout(() => {
                location.href = "/views/dashboard";
            }, 150);

            console.log(data)

            return data;
        })
        .catch((error) => {
            console.error("Hubo un problema:", error);
        });
}
