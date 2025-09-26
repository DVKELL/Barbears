const loginForm = document.querySelector("#loginForm");
const errorBox = document.querySelector("#errorBox");

const password = document.querySelector("#password");
const email = document.querySelector("#email");

const url = "http://localhost:4000/api/v1/auth/login";

loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    login();
});

async function login() {
    const content = {
        email: email.value,
        password: password.value.trim(),
    };

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(content),
        });
        console.log(res);

        if (!res.ok) {
            const errData = await res.json();
            console.warn(errData.message);
            loginErrorHandler(errData.message, errorBox);
        }

        const data = await res.json();

        if (!data) {
            console.warn(data.message);
        }

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
    } catch (error) {}
}

function loginErrorHandler(error) {
    errorBox.style.display = "block";
    errorBox.textContent = error;
    setTimeout(() => {
        errorBox.textContent = "";
        errorBox.style.display = "none";
    }, 4000);
}
