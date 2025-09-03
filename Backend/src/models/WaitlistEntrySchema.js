import mongoose from "mongoose";

const WaitlistEntrySchema = new mongoose.Schema({
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    barberId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    targetDate: { type: Date }, // preferencia del cliente (opcional)
    status: {
        type: String,
        enum: ["OPEN", "NOTIFIED", "ACCEPTED", "EXPIRED", "CANCELLED"],
        default: "OPEN",
    },
    expiresAt: { type: Date }, // si se setea, puede tener TTL
});
