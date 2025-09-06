// Importar mongoose
import mongoose from "mongoose";

//Definir el modelo para crear las citas
const appointmentSchema = new mongoose.Schema({
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    barberId: { type: Schema.Types.ObjectId, ref: "Barber", required: true },
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    status: {
        type: String,
        enum: [
            "PENDING",
            "CONFIRMED",
            "COMPLETED",
            "CANCELLED",
            "NO_SHOW",
            "RESCHEDULED",
        ],
        default: "PENDING",
    },
    origin: { type: String, enum: ["WEB", "ADMIN"], default: "WEB" },
    rescheduleoff: { type: Schema.Types.ObjectId, ref: "Appointment" },
    notes: { type: String, trim: true },
});

appointmentSchema.index({ barberId: 1, startAt: 1 }, { unique: true });
appointmentSchema.index({ clientId: 1, startAt: 1 });

appointmentSchema.pre("validate", function (next) {
    if (this.startAt >= this.endAt) {
        return next(
            Object.assign(
                new Error(
                    "La fecha de comienzo no puede ser mayor a la fecha de finalizacion"
                ),
                { status: 422 }
            )
        );
    }
    next();
});

export default mongoose.model("Appointments", appointmentSchema);
