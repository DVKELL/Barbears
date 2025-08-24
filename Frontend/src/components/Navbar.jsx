import React from "react";
import { useState } from "react";

//En react con Vite lo mejor es importar la imagen directamente
import logo from "../assets/skol-logo.jpg";

function Navbar() {
    //Estado para guardar la respuesta del fetch
    // const [status, setStatus] = useState("Cargando...");
    // const [users, setUsers] = useState([]);

    const [ingresar, setIngresar] = useState(false);
    const [registrar, setRegistrar] = useState(false);

    const API = import.meta.env.VITE_API_URL;

    //Cuando se carga el componente navbar, hace un fetch al API, guarda la respuesta en "status"
    /*
    useEffect(() => {
        fetch(`${API}/api/v1/health`, { credentials: "include" })
        .then((r) => r.json())
        .then((data) => setStatus(data))
        .catch(() => setStatus("No pude contactar la API"));
    }, [API]);
    */

    //Prueba para consultar la BBDD desde el frontend
    /*
    const click = async function nada() {
        const nada = await fetch(`${API}/prueba/users`, {
            credentials: "include",
        });
        const nada2 = await nada.json();
        
        setUsers(nada2);
        
        console.log("Usuarios: ", users);
    };
    */

    function actualizar(metodo, setMetodo) {
        metodo ? setMetodo(false) : setMetodo(true);
    }

    return (
        <header>
            <nav className="flex gap-4 justify-between px-3 py-3 bg-Vinotinto h-24 ">
                <figure className="flex  w-1/5 min-w-14 max-w-36 h-full max-h-16 ">
                    <img
                        className="w-full h-full block"
                        src={logo}
                        alt="Imagen de prueba"
                    />
                </figure>

                <div className=" w-full grid grid-rows-2 grid-cols-3 place-items-center gap-y-5 text-[13px] text-[#eddcb9] font-medium sm:flex sm:text-base justify-around items-center gap-2.5 lg:w-[60%] 2xl:w-1/3">
                    <a
                        href="#"
                        className="col-start-1 hover:border-b border-Mostaza-Hover"
                    >
                        Home
                    </a>
                    <a
                        href="#"
                        className="col-start-2 hover:border-b border-Mostaza-Hover"
                    >
                        Servicios
                    </a>
                    <a
                        // onClick={click}
                        href="#"
                        className="col-start-3 hover:border-b border-Mostaza-Hover"
                    >
                        Sobre Nosotros
                    </a>
                    <div className="col-start-3 order-last cursor-pointer relative bg-Verde-Botella p-2 rounded-md hover:bg-Verde-Hover">
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
                                href=""
                                className="block w-[110px] pb-0.5 border-b hover:text-white"
                            >
                                Como Cliente
                            </a>
                            <a href="#" className="block hover:text-white">
                                Como Barbero
                            </a>
                        </div>
                    </div>
                    <div className="text-[11px] sm:text-base col-start-2 cursor-pointer relative bg-Mostaza p-2 rounded-md hover:bg-Mostaza-Hover">
                        <span className="text-Verde-Botella">Registrarse</span>{" "}
                        <span
                            onClick={() => actualizar(registrar, setRegistrar)}
                        >
                            ⬇
                        </span>
                        <div
                            className={
                                registrar
                                    ? "absolute top-[120%] right-0.5 bg-Mostaza rounded-sm p-2 flex flex-col gap-0.5 text-Verde-Botella"
                                    : "hidden"
                            }
                        >
                            <a
                                className="block w-[110px] pb-0.5 border-b hover:text-Verde-Hover"
                                href="https://www.youtube.com/watch?v=TGKTqF4uHHs"
                            >
                                Como Cliente
                            </a>
                            <a
                                className="block hover:text-Verde-Hover"
                                href="https://tailwindcss.com/docs/display#examples"
                            >
                                Como Barbero
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
