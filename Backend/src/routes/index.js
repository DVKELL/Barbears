import { Router } from "express";
const router = Router();

//Import de rutas
import appointmentsRoutes from "./appointmentsRoutes.js";
import barberRoutes from "./barberRoutes.js";
import servicesRoutes from "./servicesRoutes.js";
import waitlistRoutes from "./waitlistRoutes.js";
import authRoutes from "./authRoutes.js";
import adminRoutes from "./adminRoutes.js";

/*PRUEBA*/
import { listServices } from "../services/serviceCatalog.service.js";

// Prueba para validar si el server esta vivo
router.get("/health", (_req, res) => {
    res.json({
        ok: true,
        time: new Date().toISOString(),
    });
});

router.get("/ejs", async (_, res) => {
    res.render("login/login");
});

router.get("/", async (_, res) => {
    const services = await listServices();
    const services1 = true;
    res.render("pages/landing", { services });
});

//Se accede con /admin/create/user
router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);
router.use("/services", servicesRoutes);
router.use("/barbers", barberRoutes);
router.use("/waitlist", waitlistRoutes);
router.use("/appointments", appointmentsRoutes);

export default router;
