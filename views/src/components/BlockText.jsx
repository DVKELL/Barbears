import React from "react";

function BlockText() {
    return (
        <div className=" w-96 flex flex-col gap-5 text-amber-100">
            <h1 className="text-4xl font-bold mb">
                Bienvenido a Skol Barber 🍻
            </h1>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Molestias similique deleniti animi, ad earum vero incidunt ipsum
                quam adipisci alias, accusantium dolorum ducimus laboriosam 
            </p>
            <strong className="bg-Mostaza p-2 rounded-2xl text-Verde-Botella">
                Tu barberia de confianza donde te podras cuidar y Brindar...
                SKOL
            </strong>
        </div>
    );
}

export default BlockText;
