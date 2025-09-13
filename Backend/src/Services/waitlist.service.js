import WaitlistEntrySchema from "../models/WaitlistEntrySchema.js";

const ACTIVE_STATUSES = ["OPEN", "NOTIFIED"];

export async function createEntry({ clientId, barberId, serviceId, dateKey }) {
    if (!clientId || !barberId || !serviceId || !dateKey) {
        const err = new Error(
            "Los campos, clientId, barberId y serviceId son requeridos"
        );
        err.status = 422;
        throw err;
    }

    //Para validar si ya posee una cita con ese barbero para ese dia
    const exists = await WaitlistEntrySchema.findOne({
        clientId,
        barberId,
        dateKey,
        status: { $in: ACTIVE_STATUSES },
        ...(serviceId ? { serviceId } : {}).lean(),
    });

    if (exists) {
        const err = new Error(
            "Ya estás en la lista de espera para ese barbero y día"
        );
        err.status = 422;
        throw err;
    }

    return WaitlistEntrySchema.create({
        clientId,
        barberId,
        serviceId,
        dateKey,
        status: "OPEN",
    });
}

export async function lisitMyEntries({ clientId }) {
    return WaitlistEntrySchema.find({ clientId })
        .sort({ createdAt: -1 })
        .lean();
}

export const deleteEntry = async ({ id, clientId }) => {
    //Busca el puesto de la waitlist
    const entry = await WaitlistEntry.findOne({
        _id: id,
        clientId,
        status: { $in: ACTIVE_STATUSES },
    });

    if (!entry) {
        const err = new Error("Entrada no encontrada");
        err.status = 404;
        throw err;
    }

    //Se pone en estado CANCELLED
    entry.status = "CANCELLED";

    await entry.save();

    return { cancelled: true };
};

// —— Contadores para la UI ——

// Cuenta total (barbero + día)
export const countForBarberDay = async ({ barberId, dateKey }) => {
    const count = await WaitlistEntry.countDocuments({
        barberId,
        dateKey,
        status: { $in: ACTIVE_STATUSES },
    });
    return { barberId, dateKey, count };
};

// Desglose por servicio (barbero + día)
export const summaryForBarberDay = async ({ barberId, dateKey }) => {
    
    //Esto no se que hace
    const rows = await WaitlistEntry.aggregate([
        { $match: { barberId, dateKey, status: { $in: ACTIVE_STATUSES } } },
        { $group: { _id: "$serviceId", count: { $sum: 1 } } },
        { $project: { _id: 0, serviceId: "$_id", count: 1 } },
        { $sort: { count: -1 } },
    ]);
    return { barberId, dateKey, byService: rows };
};
