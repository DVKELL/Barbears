import { Router } from "express";
const router = Router();

//Import de rutas
import appointmentsRoutes from "./appointmentsRoutes.js";
import barberRoutes from "./barberRoutes.js";
import servicesRoutes from "./servicesRoutes.js";
import waitlistRoutes from "./waitlistRoutes.js";

// Prueba para validar si el server esta vivo
router.get("/health", (_req, res) => {
    res.json({
        ok: true,
        time: new Date().toISOString(),
    });
});

router.use("/services", servicesRoutes);
router.use("/barbers", barberRoutes);
router.use("/waitlist", waitlistRoutes);
router.use("/appointments", appointmentsRoutes);

export default router;
