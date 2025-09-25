import { Router } from "express";
const router = Router();

//Import de rutas
import appointmentsRoutes from "./appointmentsRoutes.js";
import barberRoutes from "./barberRoutes.js";
import servicesRoutes from "./servicesRoutes.js";
import waitlistRoutes from "./waitlistRoutes.js";
import authRoutes from "./authRoutes.js";
import adminRoutes from "./adminRoutes.js";


//Se accede con /admin/create/user
router.use("/admin", adminRoutes);
router.use("/auth", authRoutes);
router.use("/services", servicesRoutes);
router.use("/barbers", barberRoutes);
router.use("/waitlist", waitlistRoutes);
router.use("/appointments", appointmentsRoutes);

export default router;
