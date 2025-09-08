import { Router } from "express";
const router = Router();

import {
    createAppointment,
    listBarberAppointments,
    listClientAppointments,
} from "../Services/scheduling.service.js";

//Crear una cita (Requiere req.user si se usa devAuth)
router.post("/", async (req, res, next) => {
    try {
        const clientId = req.user?._id || req.body.clientId;
        //se usa el spread operator porque puede que clientID no venga en el body
        const appt = await createAppointment({ clientId, ...req.body });
        res.status(201).json(appt);
    } catch (err) {
        next(err);
    }
});

//Citas del cliente autenticado
router.get("/me", async (req, res, next) => {
    try {
        const clientId = req.user?._id || req.query.clientId; //dev
        res.status(201).json(await listClientAppointments({ clientId }));
    } catch (err) {
        next(err);
    }
});

//Agenda del barbero autenticado o por query
router.get("/barber/me", async (req, res, next) => {
    try {
        const barberId = req.user?._id || req.query.barberId;

        res.status(201).json(
            await listBarberAppointments({
                barberId,
                fromISO: req.query.from,
                toISO: req.query.to,
            })
        );
    } catch (err) {
        next(err);
    }
});

export default router;
