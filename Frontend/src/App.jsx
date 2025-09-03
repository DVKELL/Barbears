import React from "react";
import Navbar from "./components/Navbar";
// import BlockText from "./components/BlockText";
import Footer from "./components/Footer";
import ServiceCard from "./components/ServiceCard";
import { BarbersPage } from "./pages/Barbers";

const MOCK_SERVICES = [
    { id: 1, name: "Corte clásico", durationMin: 30, price: 8 },
    { id: 2, name: "Afeitado tradicional", durationMin: 20, price: 6 },
    { id: 3, name: "Corte + Barba", durationMin: 45, price: 12 },
];

function App() {
    //Esto es una funcion que retorna otra funcion
    //La segunda funcion es la que manda el mensaje
    // const handleReserve = (reserva) => () => {
    //     alert(`Servicio: ${reserva.name}`);
    // };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 bg-Verde-Botella">
                <BarbersPage />
            </main>
            <Footer />
        </div>
        //min-h-screen: tamaño minimo del viewport de 100vh
        // <div className="min-h-screen flex flex-col">
        //     <Navbar /> {/*llamo al componente navbar */}
        //     <main className="mx-auto w-full flex-1 max-w-6xl flex flex-col  px-4 py-16 bg-Verde-Botella">
        //         <h1 className="text-2xl text-neutral-200 font-bold">
        //             Servicios
        //         </h1>
        //         <p className=" text-neutral-200">
        //             Elige el servicio que deseas reservar.
        //         </p>

        //         <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        //             {MOCK_SERVICES.map((i) => (
        //                 <ServiceCard
        //                     key={i.id}
        //                     // {...i} todas las propiedades del objeto  como props
        //                     {...i}
        //                     onReserve={handleReserve(i)}
        //                 />
        //             ))}
        //         </div>
        //     </main>
        //     <Footer />
        // </div>
    );
}

export default App;
