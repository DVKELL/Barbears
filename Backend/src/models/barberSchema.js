//BARBEROS

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
    //Referencia al usuario Base
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    //Nombre que se mostrara al publico
    displayName: { type: String, required: true, trim: true },

    //Servicios que ofrece
    services: [{ type: Schema.Types.ObjectId, ref: "Service", required: true }],

    //Biografia y/o descripcion
    bio: { type: String, maxlength: 1000 },

    //Link de la foto
    avatarUrl: { type: String, trim: true },

    //Define la hora en la que va a trabajar
    // ej. 'America/Caracas'
    timezone: { type: String, required: true },

    //Dias que trabaja 0=Domingo 6=Sabado
    workDays: [{ type: Number, min: 0, max: 6 }],

    //Horas que trabaja
    workHours: { type: WorkHoursSchema, required: true },
});

BarberSchema.index({ userId: 1 }, { unique: true });

export default mongoose.model("Barber", BarberSchema);
