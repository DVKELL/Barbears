import React from "react";

function Footer() {
    return (
        <footer className="bg-neutral-800 w-full h-10 flex text-white justify-evenly items-center">
            <div className=" flex w-full px-5 justify-between">
                <a href="#">Home</a>
                <a href="">Nuestras citas</a>
                <a href="">Nuestra tienda</a>
                <span>/</span>
            </div>
            <div className=" flex w-full px-5 justify-center">
                <p>
                    {/* La fecha de este año */}
                    {new Date().getFullYear()} Skol Barber - Todos los derechos
                    reservados
                </p>
            </div>
        </footer>
    );
}

export default Footer;
