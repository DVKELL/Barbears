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
                nombre: data.user.fullName,
                role: data.user.role,
            };

            if (userData.role === "ADMIN") {
                localStorage.setItem("Data", JSON.stringify(userData));
            }
            if (userData.role === "BARBER") {
                localStorage.setItem("Data", JSON.stringify(userData));
            }
            if (userData.role === "CLIENT") {
                localStorage.setItem("Data", JSON.stringify(userData));
            }
            setTimeout(() => {
                location.href = "/api/v1/clients";
            }, 150);

            return data;
        })
        .catch((error) => {
            console.error("Hubo un problema:", error);
        });
}
