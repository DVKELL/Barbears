//Para obtener la fecha en minutos 
export const addMin = (date, min)=> {
    new Date(date.getTime() + min * 6000)
}

//[aStart, aEnd) y [bStart, bEnd) se solapan si:
export const overLaps = (aStart, aEnd, bStart, bEnd) =>{
    aStart < bEnd && aEnd > bStart
}
