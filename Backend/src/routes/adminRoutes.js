import { createUser } from "../Services/admin.service.js";
import { Router } from "express";
const router = Router();

router.post("/create/user", async (req, res, next) => {
    try {
        const userCreated = await createUser(req.body);

        res.status(201).json(userCreated);
    } catch (err) {
        next(err);
    }
});

export default router;
