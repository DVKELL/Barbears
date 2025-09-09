import { Router } from "express";
const router = Router();

import { CreateProfile, listBarbers } from "../Services/barber.service.js";

import {
    listAvailabilityRange,
    publishAvailability,
} from "../Services/availability.service.js";

import asyncH from "../utils/asyncHandler.js";

//Crear perfil de barbero
router.post(
    "/profiles",
    asyncH(async (req, res) => {
        const barberProfile = await CreateProfile(req.body);

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

//Publicar Availability
router.post(
    "/availability",
    asyncH(async (req, res) => {
        res.status(201).json(await publishAvailability(req.body));
    })
);

//Consultar Availability por rango
router.get(
    "/:barberId/availability",
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
