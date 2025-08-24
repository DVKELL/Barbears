//importar solo el router
import { Router } from "express";

//Middleware
import { identifyUser } from "../middlewares/users.js";

//importar la a utilizar funcion
import {
    loginUser,
    createUser,
    listUsers, //De prueba
} from "../controllers/clientsController.js";

//Instanciar el router
const router = Router();

//Crear la ruta y pasarle la funcion
router.get("/", identifyUser);

router.get("/login/:id", loginUser);

router.post("/create/user/:role", createUser);

//PRUEBA PRUEBA PRUEBA PRUEBA
router.get("/prueba/users", listUsers);

export default router;
