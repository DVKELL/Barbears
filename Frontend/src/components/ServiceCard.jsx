import React from "react";
import TestButton from "./TestButton";

//Destructuro los props que van a llegar
function ServiceCard({ name, durationMin, price, onReserve }) {
    return (
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm transition hover:shadow-md">
            <div className="flex items-baseline justify-between">
                <h3 className="text-lg font-semibold">{name}</h3>
                <span className="text-Vinotinto font-semibold">{price}$</span>
            </div>
            <p className="mt-1 text-sm text-neutral-600">
                Duracion: {durationMin} min
            </p>
            <button
                className="mt-3 w-full rounded-xl bg-mostaza-500 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-Mostaza"
                onClick={onReserve}
            >
                Reservar
            </button>
            <div className="flex justify-evenly mt-2 gap-1.5 px-1.5">
                <TestButton buttonName={"Editar"} />
                <TestButton buttonName={""} />
            </div>
        </div>
    );
}

export default ServiceCard;
