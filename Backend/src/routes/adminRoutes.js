import { createUser } from "../Services/admin.service.js";
import { Router } from "express";
import asyncH from "../utils/asyncHandler.js";
import authGuard from "../middlewares/authGuard.js";

const router = Router();

router.post(
    "/create/user",
    authGuard(["ADMIN"]),
    asyncH(async (req, res) => {
        const userCreated = await createUser(req.body);

        res.status(201).json(userCreated);
    })
);

export default router;
