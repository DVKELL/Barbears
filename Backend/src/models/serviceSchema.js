import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    durationMin: { type: Number, required: true, min: 20, max: 180 }, //minmax equivalente en minutos
    price: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
});

//El primer parametro referencia al dato con el cual se creara el index
ServiceSchema.index({ name: 1 }, { unique: true });

export default mongoose.model("Service", ServiceSchema);
