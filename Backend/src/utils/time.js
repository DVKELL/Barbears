//Para obtener la fecha en minutos
export const addMin = (date, min) => {
    //Convierte en fecha el paramentro date y se le suma la cantidad de minutos que dura el servicio
    return new Date(date.getTime() + min * 60000);
    //obtiene los milisegundos del date que le paso y le suma los minutos que dura el servicio, * 60.000 para convertirlo en milisegundos, asi se le agregan los minutos que dura el servicio
};

//[aStart, aEnd) y [bStart, bEnd) se solapan si:
export const overLaps = (aStart, aEnd, bStart, bEnd) => {
   return aStart < bEnd && aEnd > bStart;
};
