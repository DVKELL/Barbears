//LISTA DE ESPERA

import mongoose, { Schema } from "mongoose";

const WaitlistEntrySchema = new mongoose.Schema(
    {
        //Referencia a los Clientes
        clientId: { type: Schema.Types.ObjectId, ref: "User", required: true },

        //Referencia a los Barberos
        barberId: { type: Schema.Types.ObjectId, ref: "User", required: true },

        //Referencia a los Servicios
        serviceId: {
            type: Schema.Types.ObjectId,
            ref: "Service",
            required: true,
        },

        //Dia de la cita
        dateKey: {
            type: String,
            required: true,
            match: /^\d{4}-\d{2}-\d{2}$/,
        },

        // preferencia del cliente (opcional)
        targetDate: { type: Date },

        //Estatus de la lista de espera
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

//Indices compuestos
WaitlistEntrySchema.index(
    { barberId: 1, dateKey: 1, status: 1, serviceId: 1 },
    { unique: false }
);

WaitlistEntrySchema.index({ barberId: 1, dateKey: 1, status: 1 });

export default mongoose.model("WaitlistEntry", WaitlistEntrySchema);
