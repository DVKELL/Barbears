import { useMemo, useState } from "react";
import { BARBERS, SERVICES } from "../data/mock";
import { BarberCard } from "../components/BarberCard";
import { ReserveForm } from "../components/ReserveForm";

export function BarbersPage() {
    const [query, setQuery] = useState("");
    const [serviceId, setServiceId] = useState("");

    const filtered = useMemo(() => {
        const q = query.trim().toLocaleLowerCase();

        return BARBERS.filter((i) => {
            const matchesName = !q || i.name.toLocaleLowerCase().includes(q);
            const matchesService = !serviceId || i.services.includes(serviceId);

            return matchesName && matchesService;
        });
    }, [query, serviceId]);

    const handleReserve = (barber) => (payload) => {
        alert(
            `Reservar con ${barber.name}>\nServicio= ${
                payload.serviceId
            }\nFecha=${payload.date} ${payload.time}\nNotas=${
                payload.notes || "-"
            }`
        );
    };

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-8">
            <h1 className="text-2xl font-bold">Buscar barbero</h1>
            <p className="text-neutral-600">
                Filtra por nombre y por servicio.
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <input
                    type="text"
                    placeholder="Nombre del barbero..."
                    className="rounded-xl border px-3 py-2"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <select
                    className="rounded-xl border px-3 py-2"
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                >
                    <option value="">Todos los servicios</option>
                    {SERVICES.map((s) => (
                        <option key={s.id} value={s.id}>
                            {s.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {filtered.map((b) => (
                    <div key={b.id} className="grid gap-4 sm:grid-cols-2">
                        <BarberCard
                            barber={b}
                            // onReserve={(barber) => {
                            //     /* abre form lateral si quieres */
                            // }}
                        />
                        <ReserveForm
                            services={SERVICES}
                            onSubmit={handleReserve(b)}
                        />
                    </div>
                ))}

                {filtered.length === 0 && (
                    <p className="text-neutral-600">
                        No se encontraron barberos con esos filtros.
                    </p>
                )}
            </div>
        </div>
    );
}
