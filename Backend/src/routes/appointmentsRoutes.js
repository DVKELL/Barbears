//********IMPORTS********* */
import { Router } from "express";
const router = Router();
import asyncH from "../utils/asyncHandler.js";
import authGuard from "../middlewares/authGuard.js";
import { body, query, param } from "express-validator";
import { validate } from "../middlewares/validate.js";

import {
    createAppointment,
    listBarberAppointments,
    listClientAppointments,
    cancelAppointment,
    rescheduleAppointment,
    confirmAppointment,
} from "../Services/scheduling.service.js";
/************************************************************* */
//Crear una cita (Requiere req.user si se usa devAuth)
router.post(
    "/",
    authGuard(["CLIENT", "ADMIN"]),
    validate([
        body("barberId").isMongoId().withMessage("Barber ID invalido"),
        body("serviceId").isMongoId().withMessage("Service ID invalido"),
        body("startAtISO").isISO8601().withMessage("Debe ser ISO 8601"),
    ]),
    asyncH(async (req, res) => {
        const clientId = req.user?._id || req.body.clientId;

        if (!clientId) {
            const err = new Error("Client ID requerido");
            err.status = 404;
            throw err;
        }
        //se usa el spread operator porque puede que clientID no venga en el body
        const appt = await createAppointment({ clientId, ...req.body });
        res.status(201).json(appt);
    })
);

//Citas del cliente autenticado
router.get(
    "/me",
    authGuard(["CLIENT"]),
    asyncH(async (req, res) => {
        const clientId = req.user?._id || req.query.clientId; //dev
        res.status(201).json(await listClientAppointments({ clientId }));
    })
);

//Agenda del barbero autenticado o por query
router.get(
    "/barber/me",
    authGuard(["BARBER", "ADMIN"]),
    validate([
        query("from").optional().isISO8601().withMessage("from ISO 8601"),
        query("to")
            .optional()
            .isISO8601()
            .withMessage("to ISO 8601")
            .custom(
                (to, { req }) =>
                    (!req.query.from && !to) ||
                    (req.query.from && new Date(to) > new Date(req.query.from))
            )
            .withMessage("si envías rangos, to debe ser mayor que from"),
    ]),
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
    authGuard(["CLIENT", "ADMIN", "BARBER"]),
    validate([param("id").isMongoId().withMessage("id inválido")]),
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
    validate([
        param("id").isMongoId().withMessage("id inválido"),
        body("startAtISO").isISO8601().withMessage("startAtISO ISO 8601"),
    ]),
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
    authGuard(["BARBER", "ADMIN"]),
    validate([param("id").isMongoId().withMessage("id inválido")]),
    asyncH(async (req, res) => {
        const appt = await confirmAppointment({
            id: req.params.id,
            user: req.user,
        });
        res.json(appt);
    })
);

export default router;
