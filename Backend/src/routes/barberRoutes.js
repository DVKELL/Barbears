import { Router } from "express";
const router = Router();

import {
    CreateProfile,
    listBarbers,
} from "../Services/barber.service.js";

import {
    listAvailabilityRange,
    publishAvailability,
} from "../Services/availability.service.js";

//Crear perfil de barbero
router.post("/profile", async (req, res, next) => {
    try {
        const barberProfile = await CreateProfile(req.body);

        res.status(201).json(barberProfile);
    } catch (err) {
        next(e);
    }
});

//Listar Barberos
router.get("/", async (req, res, next) => {
    try {
        const barberList = await listBarbers();

        res.status(200).barberList;
    } catch (err) {
        next(e);
    }
});

//Publicar Availability
router.post("/availability", async (req, res, next) => {
    try {
        res.status(201).json(await publishAvailability(req.body));
    } catch (err) {
        next(err);
    }
});

//Consultar Availability por rango
router.get("/:barberId/availability", async (req, res, next) => {
    try {
        const { from, to } = req.query;

        res.json(
            await listAvailabilityRange({
                barberId: req.params.barberId,
                fromISO: from,
                toISO: to,
            })
        );
    } catch (err) {}
});

export default router;
