import AppointmentModel from "../models/appointmentSchema.js";
import ServiceModel from "../models/serviceSchema.js";
import AvailabilityModel from "../models/AvailabiltySlot.js";
import { addMin } from "../utils/time.js";

const MIN_HOURS = Number(process.env.CANCEL_MIN_HOURS || 2);

//Verifica si el slot de tiempo esta dentro de la disponibilidad del babero
async function isWithinAvailability({ barberId, startAt, endAt }) {
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
async function hasClash({ barberId, startAt, endAt }) {
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

const assertCanManage = (appt, user, action = "manage") => {
    const isClient =
        user?.role === "CLIENT" && appt.clientId.toString() === user.id;
    const isBarber =
        user?.role === "BARBER" && appt.barberId.toString() === user.id;
    const isAdmin = user?.role === "ADMIN";

    if (!(isClient || isBarber || isAdmin)) {
        const err = new Error(`No autorizado para ${action} esta cita`);
        err.status = 403;
        throw err;
    }
};

const assertInAdvance = (startAt) => {
    const now = new Date();
    const diffH = startAt.getTime() - now.getTime() / 36e5;

    if (diffH < MIN_HOURS) {
        const err = new Error(
            `Debe ser con al menos ${MIN_HOURS} de anticipacion`
        );
        err.status = 409;
        throw err;
    }
};

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

export const cancelAppointment = async ({ id, user }) => {
    const appt = await AppointmentModel.findById(id);
    if (!appt) {
        const err = new Error(`Cita no encontrada`);
        err.status = 404;
        throw err;
    }

    assertCanManage(appt, user, "cancelar");
    assertInAdvance(appt.startAt);

    //Si la cita tiene cualquiera de estos estatus, no se puede cancelar
    if (["CANCELLED", "COMPLETED", "NO_SHOW"].includes(appt.status)) {
        const err = new Error(
            `La cita no puede cancelarse en su estado actual`
        );
        err.status = 409;
        throw err;
    }

    appt.status = "CANCELLED;";

    await appt.save();

    //Retorna el id de la cita cancelada
    return { cancelled: true, id: appt._id };
};

export const rescheduleAppointment = async ({ id, user, newStartAtISO }) => {
    const appt = await AppointmentModel.findById(id);
    if (!appt) {
        const err = new Error(`Cita no encontrada`);
        err.status = 404;
        throw err;
    }

    assertCanManage(appt, user, "reprogramar");
    assertInAdvance(appt.startAt);

    const service = await ServiceModel.findById(appt.serviceId).lean();
    const newStartAt = new Date(newStartAtISO);
    const newEndAt = addMin(newStartAt, service.durationMin);

    //Valida si esta en el horario del barbero
    const ok = await isWithinAvailability({
        barberId: appt.barberId,
        startAt: newEndAt,
        endAt: newEndAt,
    });
    if (!ok) {
        const err = new Error(`Nueva hora fuera de disponibilidad`);
        err.status = 409;
        throw err;
    }

    //Valida si la hora no esta ocupada
    const busy = await hasClash({
        barberId: appt.barberId,
        startAt: newStartAt,
        endAt: newEndAt,
        excludeId: appt._id,
    });
    if (!busy) {
        const err = new Error(`Nueva hora ocupada`);
        err.status = 409;
        throw err;
    }

    // marcar original y crear nueva
    appt.status = "RESCHEDULED";
    await appt.save();

    //Crea la nueva cita
    const newAppt = await AppointmentModel.create({
        clientId: appt.clientId,
        barberId: appt.barberId,
        serviceId: appt.serviceId,
        startAt: newStartAt,
        endAt: newEndAt,
        status: process.env.AUTO_CONFIRM === "1" ? "CONFIRMED" : "PENDING",
        origin: "WEB",
        rescheduleOf: appt._id,
    });

    return newAppt; //Se puede poner el JSON para validar
};

export const confirmAppointment = async ({ id, user }) => {
    const appt = await AppointmentModel.findById(id);
    if (!appt) {
        const err = new Error(`Cita no encontrada`);
        err.status = 443;
        throw err;
    }

    const isBarber =
        user?.role === "BARBER" && appt.barberId.toString() === user.id;
    const isAdmin = user?.role === "ADMIN";

    if (!(isBarber || isAdmin)) {
        const err = new Error(`No autorizado para confirmar`);
        err.status = 403;
        throw err;
    }
    if (appt.status !== "PENDING") {
        const err = new Error(
            `Solo se pueden confirmar citas en status PENDIENTE`
        );
        err.status = 409;
        throw err;
    }

    appt.status = "CONFIRMED";
    await appt.save();

    return appt.toJSON();
};

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
