import { Router } from "express";
import {
    createService,
    listServices,
} from "../Services/serviceCatalog.service.js";

//Instancia el Router
const router = Router();

//Listar los servicios activos
router.get("/", async (_req, res, next) => {
    try {
        res.json(await listServices());
    } catch (err) {
        next(err);
    }
});

//Crear un servicio, se coloca como activo de forma automatica
router.post("/", async (req, res, next) => {
    try {
        const created = await createService(req.body);

        res.status(201).json(created);
    } catch (err) {
        next(err);
    }
});

export default router;
