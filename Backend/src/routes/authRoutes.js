import { Router } from "express";
import asyncH from "../utils/asyncHandler.js";
import { registerClient, loginClient } from "../Services/auth.service.js";

const router = Router();

router.post(
    "/register",
    asyncH(async (req, res) => {
        const result = await registerClient(req.body);
        res.status(201).json(result);
    })
);

router.post(
    "/login",
    asyncH(async (req, res) => {
        const result = await loginClient(req.body);
        res.json(result);
    })
);

export default router;
