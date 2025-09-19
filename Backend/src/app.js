/*——————————IMPORTS PRINCIPALES——————————————— */

//Importar mongoose
import mongoose from "mongoose";

//Importar express
import express from "express";

//importar dotenv
import dotenv from "dotenv";
dotenv.config(); //Configuracion de dotenv

//Importar Cors
import cors from "cors";

//Importar Cookie Parser
import cookieParser from "cookie-parser";

//importar el router
import router from "./routes/index.js";

/*———————————————EJS—————————————————— */
//Path funciona para trabajar con rutas de archivos y directorios
import path from "node:path";

import { fileURLToPath } from "node:url";

//Importa express Layouts
import expressLayouts from "express-ejs-layouts";
/*————————————————————————————————— */

//Importar las sessiones de express (cookies)
import session from "express-session";

//Importar Middleware de autenticacion
import { devAuth } from "./middlewares/devAuth.js";

//Importar Middleware de Manejo de errores
import errorHandler from "./middlewares/errorHandler.js";

/* ——————————————— Conexión a base de datos ——————————————— */
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Conexion exitosa a mongodb"))
    .catch((err) => console.log("Hubo un error: ", err));

/* ——————————————— Configuración de Express ——————————————— */
// para obtener el directorio actual
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

/* ——————————————— Middlewares ——————————————— */
//Permite que las peticiones del origen ingresen
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/*—————————————————CONFIGURACION DE VISTAS EJS ——————————————————— */
//Para unir la ruta raiz con las rutas src/ y views/
app.set("views", path.join(__dirname, "views"));
//path.join, une la ruta raiz con la carpeta views
//ej: Documentos/EDT/Barbears/Backend/src/views

//Indica que el motor de plantillas sera ejs
app.set("view engine", "ejs");

//Activacion del middleware express-ejs-layouts
app.use(expressLayouts);

//Define el layout "layouts/main" por defecto para todas las vistas
app.set("layout", "layouts/main");

// archivos estáticos (css/img)
app.use(express.static(path.join(__dirname, "..", "public")));
/*————————————————————————————————————————————————————————————————— */

//Usar middleware de autenticacion
app.use(devAuth);
app.use(errorHandler);

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

/* ——————————————— Rutas Backend ———————————————*/

app.use("/api/v1/health", (_, res) => {
    res.json({ ok: true, name: "Skol Barber", time: Date.now() });
});
//todas las rutas del backend
app.use("/api/v1", router); //Utiliza todas las rutas que esten en el router

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Conectado al servidor http://localhost:${PORT}`);
});
