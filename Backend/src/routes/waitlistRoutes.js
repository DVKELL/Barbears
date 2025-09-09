import { Router } from "express";
const router = Router();
import asyncH from "../utils/asyncHandler.js";

import { createEntry, lisitMyEntries } from "../Services/waitlist.service.js";

//Crear una lista de espera para un barbero y cliente
router.post(
    "/",
    asyncH(async (req, res) => {
        const clientId = req.user?._id || req.body.clientId;
        res.status(201).json(await createEntry({ clientId, ...req.body }));
    })
);

//Listar la lista de espera
router.get(
    "/",
    asyncH(async (req, res) => {
        const clientId = req.user?._id || req.body.clientId;
        res.json(await lisitMyEntries({ clientId }));
    })
);

export default router;
