//CITAS 

// Importar mongoose
import mongoose, { Schema } from "mongoose";

//Definir el modelo para crear las citas
const appointmentSchema = new mongoose.Schema({
    //ID del cliente
    clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    //ID del barbero
    barberId: { type: Schema.Types.ObjectId, ref: "User", required: true },

    //ID del servicio
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },

    //Hora de comienzo y finalizacion de la cita
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },

    //Status de la cita
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

    //Origen
    origin: { type: String, enum: ["WEB", "ADMIN"], default: "WEB" },

    //ID de la cita original en caso de ser re agendada
    rescheduleOf: { type: Schema.Types.ObjectId, ref: "Appointment" },

    //Notas de la cita
    notes: { type: String, trim: true },
});

//Evita 2 citas al mismo tiempo con el mismo barbero
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
