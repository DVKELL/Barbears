// Importar mongoose
import mongoose from "mongoose";

//Definir el modelo para crear las citas
const appointmentSchema = new mongoose.Schema(
    {
        date: { type: Date, require: true },
        barber: {
            type: mongoose.Schema.Types.ObjectId, //El id de los barberos
            ref: "Barbers",
            require: true,
        },
        client: {
            type: mongoose.Schema.Types.ObjectId, //El id de los clientes
            ref: "Client", //Esta en users.js
            require: true,
        },
        service: {
            type: String,
            enum: [
                "Corte-Cabello",
                "Corte-Cabello-Barba",
                "Trenzas",
                "Secado-Planchado",
            ],
            default: "Corte-Cabello",
            require: true,
        },
        price: { type: Number, require: true },
        status: {
            type: String,
            enum: ["pendiente", "en progreso", "terminado", "anulado"],
            default: "pendiente",
        },
    },

    { timestamps: true }
);

export default mongoose.model("Appointments", appointmentSchema);
