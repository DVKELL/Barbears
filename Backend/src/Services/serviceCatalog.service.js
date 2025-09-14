import Service from "../models/serviceSchema.js";

//Lista todos los servicios activos
export async function listServices() {
    return Service.find({ isActive: true }).lean();
}

//Para crear los servicios:
export async function createService({ name, durationMin, price }) {
    if (!name || !durationMin || price == null) {
        const err = new Error(
            "El nombre, duración y precio son requeridos obligatoriamente"
        );
        err.status = 422;
        throw err;
    }

    //retorna la creacion del documento
    return Service.create({ name , durationMin, price, isActive: true });
}
