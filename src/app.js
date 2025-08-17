//Importar mongoose
import mongoose from "mongoose";

//Importar express
import express from "express";

//importar dotenv
import dotenv from "dotenv";
dotenv.config();

//importar el router
import router from "./routes/register&loginRoutes.js";

//Para la ruta de los archivos
import { fileURLToPath } from "url";
import path from "path";

//Importar las sessiones de express (cookies)
import session from "express-session";

/* ----------- Conexión a base de datos -------------------------- */
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("Conexion exitosa a mongodb"))
    .catch((err) => console.log("Hubo un error: ", err));

/* ----------- Configuración de Express -------------------------- */
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // para obtener el directorio actual

/* ----------- Middlewares -------------------------- */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, "public"))); // archivos estáticos

//Todas las sesiones necesitan una llave secreta, se configura asi
app.use(
    session({
        secret: process.env.SESSION_SECRET || "key-secret", //Nombre de la llave secreta
        resave: false, //Que no se guarde a menos que haya cambios
        saveUninitialized: false, //Para que no se guarde la session en navegadores de incognito
        cookie: { maxAge: 1000 * 60 * 60 }, //la duracion de la cookie: 1 hora
    })
);


// ------------- Rutas Backend ----------
app.use("/", router); //Utiliza todas las rutas que esten en el router

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Conectado al servidor http://localhost:${PORT}`);
});
