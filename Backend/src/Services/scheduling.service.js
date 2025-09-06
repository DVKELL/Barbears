import AppointmentModel from "../models/appointmentSchema.js";
import ServiceModel from "../models/serviceSchema.js";
import AvailabilityModel from "../models/AvailabiltySlot.js";
import { addMin } from "../utils/time.js";

//Verifica si el slot de tiempo esta dentro de la disponibilidad del babero
export async function isWithinAvailability({ barberId, startAt, endAt }) {
    const slot = await AvailabilityModel.findOne({
        barberId,
        isBlocked: false,
        startAt: { $lte: startAt },
        endAt: { $gte: endAt },
    }).lean();

    return !!slot;
    //Si el barbero trabaja de 9 a 18, y la cita es de 20 a 21, esta función devolverá false.
}

//Verifica si ya existe otro slot o cita que se solape con [startAt, endAt].
export async function hasClash({ barberId, startAt, endAt }) {
    const clash = await AvailabilityModel.findOne({
        barberId,
        startAt: { $lte: endAt },
        endAt: { $gte: startAt },
        /*LOGICA CENTRAL:
        LOS INTERVALOS SE SOLAPAN SI:
        nuevoStart < existenteFinal   &&   nuevoFinal > existenteStart 
        Si esto da true, es que hay solapamiento*/
    }).lean();

    return !!clash;
}

export async function createAppointment({
    clientId,
    barberId,
    serviceId,
    startAtISO,
}) {
    const service = await ServiceModel.findById(serviceId).lean();
    if (!service) {
        const err = new Error("Servicio inválido");
        err.status = 400;
        throw err;
    }

    //Calcula la hora de comienzo
    const startAt = new Date(startAtISO);

    //Llama a la funcion para agregar los minutos a la hora de comienzo
    const endAt = addMin(startAt, service.durationMin);

    //Si la cita no esta en disponibilidad:
    const ok = await isWithinAvailability({ barberId, startAt, endAt });
    if (!ok) {
        const err = new Error("Fuera de disponibilidad");
        err.status = 409;
        throw err;
    }

    //Verifica si hay solapamientos
    const busy = await hasClash({ barberId, startAt, endAt });
    if (busy) {
        const e = new Error("Horario ocupado");
        e.status = 409;
        throw e;
    }

    //Crea la cita
    const appt = await AppointmentModel.create({
        clientId,
        barberId,
        serviceId,
        startAt,
        endAt,
        status: process.env.AUTO_CONFIRM === "1" ? "CONFIRMED" : "PENDING",
        origin: "WEB",
    });

    return appt;
}

export async function listClientAppointments({ clientId }) {
    return AppointmentModel.find({ clientId }).sort({ startAt: -1 }).lean();
}

export async function listBarberAppointments({ barberId, fromISO, toISO }) {
    const id = { barberId };
    //Obtiene todas las citas en el rango de fechas
    if (fromISO && toISO) {
        id.startAt = { $gte: new Date(fromISO), $lt: new Date(toISO) };
    }

    return AppointmentModel.find(id).sort({ startAt: 1 }).lean();
}
