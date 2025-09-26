
const registerForm = document.querySelector("#registerForm");
const errorBox = document.querySelector("#errorBox");

const url = "http://localhost:4000/api/v1/auth/register";

registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const dni = e.target.dni.value;
    const fullName = e.target.fullName.value;
    const phoneNumber = e.target.phoneNumber.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dni, fullName, phoneNumber, email, password }),
    });

    console.log(res);
    if (!res.ok) {
        const errDota = await res.json();
        console.warn(errDota.errors.message);
        formErrorHandler(errDota.message);
        return;
    }
    if (res.ok) {
        window.location.href = "/views/login";
    }
});

function formErrorHandler(error) {
    errorBox.style.display = "block";
    errorBox.textContent = error;
    setTimeout(() => {
        errorBox.textContent = "";
        errorBox.style.display = "none";
    }, 4000);
}
