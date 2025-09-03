import { useState } from "react";

export function ReserveForm({ services, onSubmit }) {
    const [serviceId, setServiceId] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [notes, setNotes] = useState("");

    const canSubmit = serviceId && time && date; //solo sera true si todo existe

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!canSubmit) return;
        onSubmit({ serviceId, date, time, notes });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="space-y-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
        >
            <div>
                <label htmlFor="service" className="block text-sm font-medium">
                    Servicio
                </label>
                <select
                    id="service"
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                >
                    <option value="">Selecciona...</option>
                    {services.map((i) => (
                        <option key={i.id} value={i.id}>
                            {i.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <label htmlFor="date" className="block text-sm font-medium">
                    Fecha
                </label>
                <input
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="time" className="block text-sm font-medium">
                    Hora
                </label>
                <input
                    id="time"
                    type="time"
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                ></input>
            </div>

            <div>
                <label htmlFor="notes" className="block text-sm font-medium">
                    Notas
                </label>
                <textarea
                    id="notes"
                    rows="2"
                    className="mt-1 w-full rounded-xl border px-3 py-2"
                    value={time}
                    onChange={(e) => setNotes(e.target.value)}
                ></textarea>
            </div>
            {/* si cansubmit es false entonces se deshabilita el bonton */}
            <button
                disabled={!canSubmit}
                className="w-full rounded-xl bg-Vinotinto px-4 py-2 text-white disabled:opacity-50"
            >
                Reservar
            </button>
        </form>
    );
}
