//Importa json web token
import jwt from "jsonwebtoken";

const authGuard =
    (roles = []) =>
    (req, res, next) => {
        try {
            //Valida si hay alguna autorizacion en el header
            // const header = req.headers.authorization || "";

            //Si el header comienza con el string, corta los primeros 7 digitos para obtener solo el token, sino null
            // const token = header.startsWith("Bearer ") ? header.slice(7) : null;
            const token = req.cookies.user_token || {}; //obtener la cookie enviada desde el front

            //Si no existe el token, se retorna con error
            if (!token) return res.status(401).json({ message: "Sin token" });
            console.log(token)

            //Verificar firma y validez del JWT con la clave secreta
            const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

            //se firman name y role en el atributo req
            req.name = payload.name;
            req.role = payload.role;
            req.id = payload.sub;

            //Si existe un role y el rol no esta incluido en el payload, return
            if (roles.length && !roles.includes(payload.role)) {
                return res.status(403).json({ message: "No autorizado" });
            }

            //En el request cargamos los siguientes datos
            /*
            req.user = {
                id: payload.sub, // "subject" estándar del JWT (id del usuario)
                role: payload.role,
                name: payload.name,
            };
            */

            //Se pasa a la siguiente funcion si todo esta bien
            next();

            // Cualquier error de verificación (firma inválida, expirado, etc.) → 401
        } catch (e){
            console.log(e);
        
            return res.status(401).json({ message: "Token inválido/expirado" });
        }
    };

export default authGuard;
