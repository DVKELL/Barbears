import ServiceModel from '../models/serviceSchema.js'

//Lista todos los servicios
export async function listServices() {
    return ServiceModel.find({isActive: true}).lean();
}

//Para crear los servicios:
export async function createService({name, duration, price}) {
    if(!name || !duration || price === null) {
        const err = new Error('El nombre, duración y precio son requeridos obligatoriamente');
        err.status = 422;
        throw err;
    }
    return ServiceModel.create({name, duration, price, isActive: true })
}