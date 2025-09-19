import { Router } from "express";
const router = Router();

//Import de rutas
import appointmentsRoutes from "./appointmentsRoutes.js";
import barberRoutes from "./barberRoutes.js";
import servicesRoutes from "./servicesRoutes.js";
import waitlistRoutes from "./waitlistRoutes.js";
import authRoutes from "./authRoutes.js";
import adminRoutes from "./adminRoutes.js";

// Prueba para validar si el server esta vivo
router.get("/health", (_req, res) => {
    res.json({
        ok: true,
        time: new Date().toISOString(),
    });
});

router.get("/ejs", (_, res) => {
    res.render("login/login");
});

//Se accede con /admin/create/user
router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);
router.use("/services", servicesRoutes);
router.use("/barbers", barberRoutes);
router.use("/waitlist", waitlistRoutes);
router.use("/appointments", appointmentsRoutes);

export default router;
