import { Router } from "express";
const router = Router();
import asyncH from "../utils/asyncHandler.js";
import authGuard from "../middlewares/authGuard.js";

import { validate } from "../middlewares/validate.js";
import { body, query, param } from "express-validator";

import { createEntry, listMyEntries } from "../Services/waitlist.service.js";

//Crear una entrada (para el cliente)
router.post(
    "/",
    validate([
        body("barberId").isMongoId().withMessage("barberId inválido"),
        body("dateKey")
            .matches(/^\d{4}-\d{2}-\d{2}$/)
            .withMessage("Debe ser dateKey YYYY-MM-DD"),
        body("serviceId")
            .optional()
            .isMongoId()
            .withMessage("serviceId inválido"),
    ]),
    asyncH(async (req, res) => {
        const clientId = req.user?._id || req.body.clientId; //para desarrollo
        res.status(201).json(await createEntry({ clientId, ...req.body }));
    })
);

//Listar la lista de espera para clientes
router.get(
    "/me",
    authGuard(["CLIENT"]),
    asyncH(async (req, res) => {
        const clientId = req.user?._id || req.body.clientId;
        res.json(await listMyEntries({ clientId }));
    })
);

// Cancelar mi entrada
router.delete(
    "/:id",
    authGuard(["CLIENT", "ADMIN"]),
    validate([param("id").isMongoId().withMessage("id inválido")]),
    asyncH(async (req, res) => {
        await deleteEntry({ id: req.params.id, clientId: req.user.id });
        res.status(204).end();
    })
);

// —— Contadores para UI ———————————

// Total por barbero/día
router.get(
    "/barber/:barberId/count",
    validate([
        param("barberId").isMongoId().withMessage("barberId inválido"),
        query("dateKey")
            .matches(/^\d{4}-\d{2}-\d{2}$/)
            .withMessage("dateKey debe ser: YYYY-MM-DD"),
    ]),
    asyncH(async (req, res) => {
        const { barberId } = req.params;
        const { dateKey } = req.query; // YYYY-MM-DD
        res.json(await countForBarberDay({ barberId, dateKey }));
    })
);

// Desglose por servicio
router.get(
    "/barber/:barberId/summary",
    validate([
        param("barberId").isMongoId().withMessage("barberId inválido"),
        query("dateKey")
            .matches(/^\d{4}-\d{2}-\d{2}$/)
            .withMessage("dateKey debe ser YYYY-MM-DD"),
    ]),
    asyncH(async (req, res) => {
        const { barberId } = req.params;
        const { dateKey } = req.query;
        res.json(await summaryForBarberDay({ barberId, dateKey }));
    })
);

export default router;
