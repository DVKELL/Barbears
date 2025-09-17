import { createUser } from "../Services/admin.service.js";
import { Router } from "express";
import asyncH from "../utils/asyncHandler.js";
import authGuard from "../middlewares/authGuard.js";
import validate from "../middlewares/validate.js";
import { body } from "express-validator";

const router = Router();

//Crear un usuario
router.post(
    "/create/user",
    authGuard(["ADMIN"]),
    validate([
        body("fullName").trim().isLength({ min: 2, max: 80 }),
        body("email").isEmail().normalizeEmail(),
        body("password").isLength({ min: 6 }),
        body("role").isIn(["ADMIN"]),
        body("dni").optional().isString().isLength({ min: 6 }),
    ]),
    asyncH(async (req, res) => {
        const userCreated = await createUser(req.body);

        res.status(201).json(userCreated);
    })
);

export default router;