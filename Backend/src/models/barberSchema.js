import mongoose, { Schema } from "mongoose";

//Define el horario de trabajo del barbero
const WorkHoursSchema = new mongoose.Schema(
    {
        start: { type: String, required: true }, //Ej: 09:00
        end: { type: String, required: true }, // Ej: 11:00
    },
    { _id: false }
);

const BarberSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    displayName: { type: String, required: true, trim: true },
    services: [{ type: Schema.Types.ObjectId, ref: "Service", required: true }],
    bio: { type: String, maxlength: 1000 },
    avatarUrl: { type: String, trim: true },
    timezone: { type: String, required: true }, // ej. 'America/Mexico_City'
    workDays: [{ type: Number, min: 0, max: 6 }], //Dias que trabaja 0=Domingo 6=Sabado
    workHours: { type: WorkHoursSchema, required: true },
});

BarberSchema.index({ userId: 1 }, { unique: true });

export default mongoose.model("Barber", BarberSchema);
