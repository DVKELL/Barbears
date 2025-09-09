import { Router } from "express";
const router = Router();
import asyncH from "../utils/asyncHandler.js";

import {
    createAppointment,
    listBarberAppointments,
    listClientAppointments,
} from "../Services/scheduling.service.js";

//Crear una cita (Requiere req.user si se usa devAuth)
router.post(
    "/",
    asyncH(async (req, res) => {
        const clientId = req.user?._id || req.body.clientId;
        //se usa el spread operator porque puede que clientID no venga en el body
        const appt = await createAppointment({ clientId, ...req.body });
        res.status(201).json(appt);
    })
);

//Citas del cliente autenticado
router.get(
    "/me",
    asyncH(async (req, res) => {
        const clientId = req.user?._id || req.query.clientId; //dev
        res.status(201).json(await listClientAppointments({ clientId }));
    })
);

//Agenda del barbero autenticado o por query
router.get(
    "/barber/me",
    asyncH(async (req, res) => {
        const barberId = req.user?._id || req.query.barberId;

        res.status(201).json(
            await listBarberAppointments({
                barberId,
                fromISO: req.query.from,
                toISO: req.query.to,
            })
        );
    })
);

export default router;
