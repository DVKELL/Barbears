import { Router } from "express";
const router = Router();
import asyncH from "../utils/asyncHandler.js";
import authGuard from "../middlewares/authGuard.js";

import {
    createAppointment,
    listBarberAppointments,
    listClientAppointments,
    cancelAppointment,
    rescheduleAppointment,
    confirmAppointment,
} from "../Services/scheduling.service.js";

//Crear una cita (Requiere req.user si se usa devAuth)
router.post(
    "/",
    authGuard(["CLIENTE", "ADMIN"]),
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
    authGuard(["CLIENTE"]),
    asyncH(async (req, res) => {
        const clientId = req.user?._id || req.query.clientId; //dev
        res.status(201).json(await listClientAppointments({ clientId }));
    })
);

//Agenda del barbero autenticado o por query
router.get(
    "/barber/me",
    authGuard(["BARBERO", "ADMIN"]),
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

router.patch(
    "/:id/cancel",
    authGuard(["CLIENTE", "ADMIN", "BARBER"]),
    asyncH(async (req, res) => {
        const result = await cancelAppointment({
            id: req.params.id,
            user: req.user,
        });
        res.status(201).json(result);
    })
);

router.patch(
    "/:id/reschedule",
    authGuard(["CLIENT", "BARBER", "ADMIN"]),
    asyncH(async (req, res) => {
        const newAppt = await rescheduleAppointment({
            id: req.params.id,
            user: req.user,
            newStartAtISO: req.body.startAtISO,
        });
        res.status(201).json(newAppt);
    })
);

router.patch(
    "/:id/confirm",
    authGuard(["BARBERO", "ADMIN"]),
    asyncH(async (req, res) => {
        const appt = await confirmAppointment({
            id: req.params.id,
            user: req.user,
        });
        res.json(appt);
    })
);

export default router;
