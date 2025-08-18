import React from "react";
import { useState } from "react";

//En react con Vite lo mejor es importar la imagen directamente
import logo from "../assets/skol-logo.jpg";

function Navbar() {
    const [ingresar, setIngresar] = useState(false);
    const [registrar, setRegistrar] = useState(false);

    function actualizar(metodo, setMetodo) {
        metodo ? setMetodo(false) : setMetodo(true);
    }

    return (
        <nav className="flex gap-4 justify-between px-3 py-5 bg-Vinotinto h-24 ">
            <figure className="flex   w-1/5 max-w-36 h-full ">
                <img
                    className="w-full h-full block"
                    src={logo}
                    alt="Imagen de prueba"
                />
            </figure>

            <div className=" w-full flex flex-wrap justify-around items-center gap-2.5 text-[15px] text-[#eddcb9] font-medium lg:w-[60%] 2xl:w-1/3">
                <a href="#" className="hover:border-b border-Mostaza-Hover">
                    Home
                </a>
                <a href="#" className="hover:border-b border-Mostaza-Hover">
                    Servicios
                </a>
                <a href="#" className="hover:border-b border-Mostaza-Hover">
                    Sobre Nosotros
                </a>
                <div className="cursor-pointer relative bg-Verde-Botella p-2 rounded-md hover:bg-Verde-Hover">
                    <span className="mr-0.5">Ingresar</span>
                    <span onClick={() => actualizar(ingresar, setIngresar)}>
                        ⬇
                    </span>
                    <div
                        className={
                            ingresar
                                ? "absolute top-[120%] right-0.5 bg-Verde-Botella rounded-sm p-2 flex flex-col gap-0.5"
                                : "hidden"
                        }
                    >
                        <a
                            href="#"
                            className="block w-[100px] pb-0.5 border-b hover:text-white"
                        >
                            Como Cliente
                        </a>
                        <a href="#" className="block hover:text-white">
                            Como Barbero
                        </a>
                    </div>
                </div>
                <div className="cursor-pointer relative bg-Mostaza p-2 rounded-md hover:bg-Mostaza-Hover">
                    <span className="text-white">Registrarse</span>{" "}
                    <span onClick={() => actualizar(registrar, setRegistrar)}>
                        ⬇
                    </span>
                    <div
                        className={
                            registrar
                                ? "absolute top-[120%] right-0.5 bg-Mostaza rounded-sm p-2 flex flex-col gap-0.5 text-white"
                                : "hidden"
                        }
                    >
                        <a
                            className="block w-[100px] pb-0.5 border-b hover:text-amber-900"
                            href="https://www.youtube.com/watch?v=TGKTqF4uHHs"
                        >
                            Como Cliente
                        </a>
                        <a
                            className="block hover:text-amber-900"
                            href="https://tailwindcss.com/docs/display#examples"
                        >
                            Como Barbero
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
