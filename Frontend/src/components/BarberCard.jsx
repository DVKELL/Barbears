import React from "react";

export function BarberCard({ barber, onReserve }) {
    return (
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
            <div className=" flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold">{barber.name}</h3>
                    <p className="text-sm text-neutral-600">
                        {barber.service}
                    </p>
                    <p className="text-sm text-neutral-600">{barber.rating} </p>
                </div>
                <button
                    onClick={() => onReserve(barber)}
                    className="rounded-xl bg-Mostaza px3 py-1.5 text-sm font-medium text-neutral-900 hover:bg-Mostaza"
                >
                    Reservar
                </button>
            </div>
        </div>
    );
}
