import { Router } from "express";
const viewRoutes = Router();

import { listServices } from "../services/serviceCatalog.service.js";
import { listBarbers } from "../services/barber.service.js";
import authGuard from "../middlewares/authGuard.js";

// Landing Page
viewRoutes.get("/", async (_req, res) => {
    const services = await listServices();
    const barbers = await listBarbers();

    const data = {
        services,
        barbers,
    };
    res.render("pages/landing", data);
});

//LOGIN
viewRoutes.get("/login", async (_, res) => {
    res.render("users/loginForm");
});

//FORMULARIO DE REGISTRO
viewRoutes.get("/register", async (req, res) => {
    const customer = req.cookies?.user_token?.user?.rol;
    if (customer === "ADMIN") {
        return res.render("users/registerForm", { customer });
    }
    res.render("users/registerForm");
});

//LOGOUT
viewRoutes.get("/logout", (_, res) => {
    res.clearCookie("user_token");
    res.redirect("/views/login");
});

//DASHBOARD
viewRoutes.get(
    "/dashboard",
    authGuard(["CLIENT", "ADMIN", "BARBER"]),
    (req, res) => {
        const data = {
            rol: req.role,
            nombre: req.name,
        };

        res.render("users/clientPage", { data });
    }
);

export default viewRoutes;
