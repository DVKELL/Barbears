//importar solo el router
import { Router } from "express";

//Middleware 
import {identifyUser} from '../middlewares/users.js' 

//importar la a utilizar funcion
import { loginUser, createUser } from "../controllers/clientsController.js";

//Instanciar el router
const router = Router();

//Crear la ruta y pasarle la funcion
router.get("/", identifyUser);


router.get("/login/:id", loginUser);

router.post("/create/user/:role", createUser);

export default router;


