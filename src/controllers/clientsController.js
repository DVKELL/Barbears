//Importar el modelo de la bbdd a usar
import Client from "../models/usersSchema.js";

//Librebria para encriptar
import bcrypt from "bcrypt";

//Crear una funcion para validar si el usuario esta registrado
export const loginUser = async (req, res) => {
    const { dni, password } = req.body;
    const { role } = req.params; //parametro

    // try {
    const finded = await Client.findOne({ dni, role }); //Si no se encuentra, retorna null

    //Si no se encuentra el usuario se regresa a la ruta raiz y arroja un error
    if (!finded) return res.send({ error: "usuario no encontrado" });

    //Crear logica para validar si el usuario intenta ingresar mas de 3 veces

    /*-----------COMPARAR PASSWORD INGRESADA--------*/

    //guarda en la constante la comparacion del password ingresado por el usuario y el que esta en la BBDD
    const ok = await bcrypt.compare(password, finded.password);

    //Si la comparacion da false, el usuario se regresa a la ruta raiz y arroja un error
    if (!ok) return res.send({ error: "Contraseña incorrecta" });

    //Se guarda la session en la cookie
    req.session.user = {
        id: finded.id,
        role: finded.role,
        name: finded.name,
        dni: finded.dni,
        //Preguntar si debo quitar el DNI de la session guardada en la cookie
    };

    //Si es true, el usuario se redirige a la visual del login
    return res.send({
        message: "Usuario encontrado redirigir al login",
        finded,
    });
    // } catch (err) {
    //     return res.send({ error: err });
    // }
};

//Crear un nuevo usuario
export const createUser = async (req, res) => {
    const { role } = req.params;

    const { dni, fullName, phoneNumber, email, password } = req.body;

    //Validacion de que todos los campos lleguen
    if (!dni || !fullName || !phoneNumber || !email || !password) {
        return res.send("Todos los campos deben estar llenos");
    }

    //Si llegan
    try {
        const user = await Client.create({
            dni,
            fullName,
            phoneNumber,
            email,
            password,
            role: role,
        });
        return res.send({ message: "usuario creado", user });
    } catch (err) {
        return res.send({ err });
    }
};
