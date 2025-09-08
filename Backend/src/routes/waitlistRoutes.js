import { Router } from "express";
const router = Router();

import { createEntry, lisitMyEntries } from "../Services/waitlist.service.js";

//Crear una lista de espera para un barbero y cliente
router.post("/", async (req, res, next) => {
    try {
        const clientId = req.user?._id || req.body.clientId;
        res.status(201).json(await createEntry({ clientId, ...req.body }));
    } catch (err) {
        next(err);
    }
});

//Listar la lista de espera
router.get("/", async (req, res, next) => {
    try {
        const clientId = req.user?._id || req.body.clientId;
        res.json(await lisitMyEntries({ clientId }));
    } catch (err) {
        next(err);
    }
});

export default router;
