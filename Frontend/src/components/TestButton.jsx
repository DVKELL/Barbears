import React from "react";

function TestButton({ buttonName }) {
    const valueButton = buttonName === "Editar" ? buttonName : "Eliminar";
    const wFunc = valueButton === "Editar";

    function changesHandler(e) {
        let value = e.target.textContent;

        alert(value);
    }

    const deleteApt = (e) => {
        console.log(e.target.parentElement.parentElement);
    };

    return (
        <>
            <button
                className="cursor-pointer bg-Verde-Hover text-white  rounded-2xl px-2 py-2 w-full"
                onClick={wFunc ? changesHandler : deleteApt}
            >
                {valueButton}
            </button>
        </>
    );
}

export default TestButton;
