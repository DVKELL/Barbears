import BarberProfile from '../models/barberSchema.js'
import UserModel from '../models/usersSchema.js'

export async function CreateProfile({userId, displayName, services, timezone, workDays, workZone}) {
    const user = await UserModel.findById(userId).lean();

    if(!user || user.role !== 'BARBER'){
        const err = new Error('El usuario no existe o no es un barbero');
        err.status = 400;
        throw err;
    }

    return BarberProfile.create({userId, displayName, services, timezone, workDays, workZone})
}

export async function listBarbers() {

    //Trae todos los barberos que esten en la BBDD solo con los campos indicados en el select
    return BarberProfile.find({}).select('displayName services timezone workDays workHours avatarUrl userId').lean();
}

export async function getBarberProfile(id) {
    return BarberProfile.find(id).lean();
}