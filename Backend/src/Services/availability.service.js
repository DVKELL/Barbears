import AvailabilitySlot from '../models/AvailabiltySlot.js'

export async function publishAvailability({barberId, startAtISO, endAtISO, isBlocked = false, notes}) {
    const startAt = new Date(startAtISO);
    const endAt = new Date(endAtISO);

    if(!startAt < endAt){
        const err = new Error('La hora de comienzo no puede ser menor a la hora de finalizacion');
        err.status = 400;
        throw err;
    }

    return AvailabilitySlot.create({barberId, startAt, endAt, isBlocked, notes});
}

export async function listAvailabilityRange({barberId, fromISO, toISO}) {
    const from = new Date(fromISO), to = new Date(toISO)

    return AvailabilitySlot.find({
        barberId,
        startAt: {$lt: to},
        endAt: {$gt: from},
        isblocked: false
    }).sort({startAt: 1}).lean()
}