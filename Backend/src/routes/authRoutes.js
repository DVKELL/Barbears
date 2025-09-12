import { Router } from "express";
import asyncH from "../utils/asyncHandler.js";
import {
    registerClient,
    loginClient,
    refreshFromToken,
} from "../Services/auth.service.js";

const router = Router();

const setRefreshCookie = (res, token) => {
    const days = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7);
    res.cookie("refresToken", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: days * 24 * 60 * 60 * 1000,
        path: "/",
    });
};

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

//Refresca el Token
router.post(
    "/refresh",
    asyncH(async (req, res) => {
        const rt = req.cookies?.refreshToken || req.body?.refreshToken; // body solo para pruebas
        const { user, accessToken, refreshToken } = await refreshFromToken(rt);
        setRefreshCookie(res, refreshToken); //rotacion
        res.json({ user, accessToken });
    })
);

router.post(
    "/logout",
    asyncH(async (_req, res) => {
        res.clearCookie("refreshToken", { path: "/" });
        res.status(204).end();
    })
);

export default router;
