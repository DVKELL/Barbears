import { Router } from "express";
import {
    createService,
    listServices,
} from "../Services/serviceCatalog.service.js";

import asyncH from "../utils/asyncHandler.js";

//Middleware para verificar el rol de cada usuario
import authGuard from "../middlewares/authGuard.js";

//Express validator
import { body } from "express-validator";
import { validate } from "../middlewares/validate.js";

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
    validate([ //Validaciones de express-validator
        body("name")
            .trim()
            .isLength({ min: 2, max: 80 })
            .withMessage("Nombre entre 2 y 80 caracteres"),
        body("price")
            .isFloat({ min: 0 })
            .withMessage("El precio debe ser superior a 0"),
        body("durationMin")
            .isInt({ min: 10, max: 240 })
            .withMessage("Debe tomar enter 20 y 240 Minutos"),
    ]),
    asyncH(async (req, res) => {
        const created = await createService(req.body);

        res.status(201).json(created);
    })
);

export default router;
