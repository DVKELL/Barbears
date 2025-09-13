import mongoose, { Schema } from "mongoose";

const WaitlistEntrySchema = new mongoose.Schema(
    {
        clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        barberId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        serviceId: {
            type: Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },
        dateKey: { type: String, required: true },
        targetDate: { type: Date }, // preferencia del cliente (opcional)
        status: {
            type: String,
            enum: ["OPEN", "NOTIFIED", "ACCEPTED", "EXPIRED", "CANCELLED"],
            default: "OPEN",
        },
        expiresAt: { type: Date }, // si se setea, puede tener TTL
    },
    { timestamps: true }
);

//Genera dateKey automaticamente en base a targetDate
WaitlistEntrySchema.pre("save", function (next) {
    if (this.targetDate) {
        const date = new Date(this.targetDate);
        this.dateKey = date.toISOString().slice(0, 10);
    }
    next();
});

//Iindice compuesto
WaitlistEntrySchema.index(
    { barberId: 1, dateKey: 1, status: 1, serviceId: 1 },
    { unique: false }
);

export default mongoose.model("WaitlistEntry", WaitlistEntrySchema);
