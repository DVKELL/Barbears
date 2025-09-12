import { Router } from "express";
import {
    createService,
    listServices,
} from "../Services/serviceCatalog.service.js";

import asyncH from "../utils/asyncHandler.js";

import authGuard from "../middlewares/authGuard.js";

//Instancia el Router
const router = Router();

//Listar los servicios activos
router.get(
    "/",
    asyncH(async (_req, res) => {
        res.json(await listServices());
    })
);

//Crear un servicio, se coloca como activo de forma automatica
router.post(
    "/",
    authGuard(["ADMIN"]), //VALIDA SI ES ADMIN
    asyncH(async (req, res) => {
        const created = await createService(req.body);

        res.status(201).json(created);
    })
);

export default router;
