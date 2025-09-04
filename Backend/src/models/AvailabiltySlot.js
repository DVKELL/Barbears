import mongoose, { mongo, Schema, Types } from "mongoose";

const AvailabilitySlotSchema = new mongoose.Schema({
    barberId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    isBlocked: { type: Boolean, default: false },
    notes: { type: String, trim: true },
});

//Para detectar si ya existe un slot en un horario específico de ese barbero.
AvailabilitySlotSchema.index({ barberId: 1, startAt: 1 });
AvailabilitySlotSchema.index({ barberId: 1, endAt: 1 });

//Valida que la hora de inicio sea menor a la hora de finalizacion del servicio
AvailabilitySlotSchema.pre("validate", function (next) {
    if (this.startAt >= this.endAt) {
        return next(
            Object.assign(new Error("startAt debe ser < endAt"), {
                status: 422,
            })
        );
    }
    next();
});

export default mongoose.model("AvailabilitySlot", AvailabilitySlotSchema);
