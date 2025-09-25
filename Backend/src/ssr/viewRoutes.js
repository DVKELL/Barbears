import { Router } from "express";
const viewRoutes = Router();

import {listServices} from '../Services/serviceCatalog.service.js';
import {listBarbers} from '../Services/barber.service.js';
import authGuard from "../middlewares/authGuard.js";

// Prueba para validar si el server esta vivo
viewRoutes.get("/", async (_req, res) => {
       const services = await listServices();
        const barbers = await listBarbers();
    
        const data = {
            services,
            barbers,
        };
    res.render("pages/landing", data)
});

//PROBANDO EL RENDER DE LAS VISTAS
viewRoutes.get("/login", async (_, res) => {
    res.render("users/loginForm");
});

//
viewRoutes.get("/dashboard", authGuard(["CLIENT", "ADMIN", "BARBER"]),  (req, res) => {
    const rol = req.role
    console.log(rol)
    res.render("users/clientPage");
});


export default viewRoutes;