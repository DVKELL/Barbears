import WaitlistEntry from "../models/WaitlistEntrySchema.js";

export async function createEntry({
    clientId,
    barberId,
    serviceId,
    targetDateISO,
}) {
    return WaitlistEntry.create({
        clientId,
        barberId,
        serviceId,
        targetDate: targetDateISO ? new Date(targetDateISO) : undefined,
        status: "OPEN",
    });
}

export async function lisitMyEntries({ clientId }) {
    return WaitlistEntry.find({ clientId }).sort({ createdAt: -1 }).lean();
}
