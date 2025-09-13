//SERVICIOS

import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
    //Nombre del servicio
    name: { type: String, required: true, trim: true },

    //Duracion del servicio en minutos
    durationMin: { type: Number, required: true, min: 10, max: 180 },

    //Precio del servicio
    price: { type: Number, required: true, min: 0 },

    //Si esta activo o no
    isActive: { type: Boolean, default: true },
});

//Asegura que el nombre del servicio sea unico
ServiceSchema.index({ name: 1 }, { unique: true });

export default mongoose.model("Service", ServiceSchema);
