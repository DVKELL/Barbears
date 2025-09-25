import { Router } from "express";
import asyncH from "../utils/asyncHandler.js";
import { body } from "express-validator";
import { validate } from "../middlewares/validate.js";

import {
    registerClient,
    loginClient,
    refreshFromToken,
} from "../services/auth.service.js";

const router = Router();

//Solicitarle explicacion al prof
const setRefreshCookie = (res, token) => {
    const days = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7);
    res.cookie("refreshToken", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: days * 24 * 60 * 60 * 1000,
        path: "/",
    });
};

//Registrar un cliente
router.post(
    "/register",
    validate([
        body("fullName")
            .trim()
            .isLength({ min: 2, max: 80 })
            .withMessage("Nombre de 2 a 80 caracteres"),
        body("email")
            .trim()
            .isEmail()
            .withMessage("Correo inválido")
            .normalizeEmail(),
        body("password")
            .isLength({ min: 6 })
            .withMessage("contraseña mínimo 6"),
    ]),
    asyncH(async (req, res) => {
        const result = await registerClient(req.body);
        res.status(201).json(result);
    })
);

//Login
router.post(
    "/login",
    validate([
        body("email").trim().isEmail().withMessage("Correo inválido"),
        // body("password")
        //     .isLength({ min: 6 })
        //     .withMessage("contraseña mínimo 6 digitos"),
    ]),
    asyncH(async (req, res) => {
        const result = await loginClient(req.body);
        
        //result.accessToken da el token de JWT
        //result.user.fullName y .role, dan el rol y el nombre del usuario logeadoo
        const responseBody ={
            token: result.accessToken,
            user: {
                name: result.user.fullName,
                rol: result.user.role
            }
        }

        // console.log(responseBody);
        res.cookie("user_token", responseBody, {
            //Hace que la cookie no sea accesible al javascript del cliente
            httpOnly: true,  

            //Una hora para que expire el token
            maxAge: 3600000
        })
        
        res.json({
            userLogged: result,
            responseBody
        });
    })

    /*Enviar la cookie con res.cookie('NOMBRE DEL TOKEN', informacion que se va a guardar, {
    httpOnly: true,
    maxAge: 3600000})
    Se debee guardar el payload 
    esto setea req.cookies.NOMBRE DEL TOKEN, para poder realizar la validacion de rutas*/
);

//Solicitarle explicacion al prof
//Refresca el Token
router.post(
    "/refresh",
    validate([
        // opcional body.refreshToken para pruebas (normalmente viene en cookie)
        body("refreshToken")
            .optional()
            .isString()
            .withMessage("refreshToken string"),
    ]),
    asyncH(async (req, res) => {
        const rt = req.cookies?.refreshToken || req.body?.refreshToken; // body solo para pruebas
        const { user, accessToken, refreshToken } = await refreshFromToken(rt);
        setRefreshCookie(res, refreshToken); //rotacion
        res.json({ user, accessToken });
    })
);

//Funciona pero hay que PREGUNTARLE AL PROF que hace clear.Cookie
router.post(
    "/logout",
    asyncH(async (_req, res) => {
        res.clearCookie("refreshToken", { path: "/" });
        res.status(204).end();
    })
);

export default router;
