//Importar Express
import { Router } from "express";
const router = Router();

//Funciones de barberos
import {
    createProfile,
    listBarbers,
    getBarberProfile,
} from "../Services/barber.service.js";

//Funciones de disponibilidad
import {
    listAvailabilityRange,
    publishAvailability,
} from "../Services/availability.service.js";

//Helper
import asyncH from "../utils/asyncHandler.js";
import authGuard from "../middlewares/authGuard.js";

//Express-validator
import { body, param, query } from "express-validator";
import { validate } from "../middlewares/validate.js";

/** —————————————————————————————————————————————————————————*/

const hhmm = /^([01]\d|2[0-3]):([0-5]\d)$/;

//Crear perfil de barbero
router.post(
    "/profiles",
    authGuard(["ADMIN", "BARBER"]),
    validate([
        body("userId").isMongoId().withMessage("userId inválido"),
        body("displayName")
            .trim()
            .isLength({ min: 2, max: 80 })
            .withMessage("displayName 2 a 80 caracteres"),
        body("services")
            .isArray({ min: 0 })
            .withMessage("falta services array"),
        body("services.*")
            .optional()
            .isMongoId()
            .withMessage("serviceId inválido"),
        body("timezone").isString().withMessage("timezone requerido"),
        body("workDays")
            .optional()
            .isArray()
            .withMessage("falta workDays array"),
        body("workDays.*")
            .optional()
            .isInt({ min: 0, max: 6 })
            .withMessage("workDays de 0 a 6"),
        body("workHours.start")
            .matches(hhmm)
            .withMessage("workHours.start debe ser en formato HH:mm"),
        body("workHours.end")
            .matches(hhmm)
            .withMessage("workHours.end debe ser en formato HH:mm"),
    ]),
    asyncH(async (req, res) => {
        const barberProfile = await createProfile(req.body);

        res.status(201).json(barberProfile);
    })
);

//Listar Barberos
router.get(
    "/",
    asyncH(async (_req, res) => {
        const barberList = await listBarbers();

        res.status(200).json(barberList);
    })
);

//Obtener un barbero en especifico
router.get(
    "/:id",
    validate([param("id").isMongoId().withMessage("id inválido")]),
    asyncH(async (req, res) => res.json(await getBarberProfile(req.params.id)))
);

//Publicar Availability
router.post(
    "/availability",
    authGuard(["BARBER", "ADMIN"]),
    validate([
        body("barberId").isMongoId().withMessage("barberId inválido"),
        body("startAtISO")
            .isISO8601()
            .withMessage("startAtISO debe ser ISO 8601"),
        body("endAtISO")
            .isISO8601()
            .withMessage("endAtISO debe ser ISO 8601")
            .custom(
                (end, { req }) => new Date(end) > new Date(req.body.startAtISO)
            )
            .withMessage("Hora de final mayor que Hora de inicio"),
        body("isBlocked").optional().isBoolean().toBoolean(),
        body("notes").optional().trim().isLength({ max: 300 }),
    ]),
    asyncH(async (req, res) => {
        res.status(201).json(await publishAvailability(req.body));
    })
);

//Consultar Availability por rango
router.get(
    "/:barberId/availability",
    validate([
        param("barberId").isMongoId().withMessage("BarberID invalido"),
        query("from").isISO8601().withMessage("from debe ser ISO 8601"),
        query("to")
            .isISO8601()
            .withMessage("to debe ser ISO 8601")
            .custom((to, { req }) => new Date(to) > new Date(req.query.from))
            .withMessage("to es mayor que from"),
    ]),
    asyncH(async (req, res) => {
        const { from, to } = req.query;

        res.json(
            await listAvailabilityRange({
                barberId: req.params.barberId,
                fromISO: from,
                toISO: to,
            })
        );
    })
);

export default router;
