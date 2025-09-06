//Importar mongoose
import mongoose from "mongoose";

//Importar express
import express from "express";

//importar dotenv
import dotenv from "dotenv";
dotenv.config();

//Importar Cors
import cors from "cors";

//Importar Cookie Parser
import cookieParser from "cookie-parser";

//importar el router
import router from "./routes/register&loginRoutes.js";

//Para la ruta de los archivos
import { fileURLToPath } from "url";
import path from "path";

//Importar las sessiones de express (cookies)
import session from "express-session";

//Importar Middleware de autenticacion
import { devAuth } from "./middlewares/devAuth.js";

/* ----------- Conexión a base de datos -------------------------- */
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Conexion exitosa a mongodb"))
    .catch((err) => console.log("Hubo un error: ", err));

/* ----------- Configuración de Express -------------------------- */
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // para obtener el directorio actual

/* ----------- Middlewares -------------------------- */
//Permite que las peticiones del origen ingresen
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Usar middleware de autenticacion
app.use(devAuth);

//Activa el parser del cookies para poder leerlas en req.cookies
app.use(cookieParser());

//Todas las sesiones necesitan una llave secreta, se configura asi
app.use(
    session({
        secret: process.env.SESSION_SECRET || "key-secret", //Nombre de la llave secreta
        resave: false, //Que no se guarde a menos que haya cambios
        saveUninitialized: false, //Para que no se guarde la session en navegadores de incognito
        cookie: { maxAge: 1000 * 60 * 60 }, //la duracion de la cookie: 1 hora
    })
);

/* ------------- Rutas Backend ----------*/

app.use("/api/v1/health", (_, res) => {
    res.json({ ok: true, name: "Skol Barber", time: Date.now() });
});
app.use("/", router); //Utiliza todas las rutas que esten en el router

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Conectado al servidor http://localhost:${PORT}`);
});
