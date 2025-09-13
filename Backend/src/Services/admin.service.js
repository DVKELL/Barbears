import User from "../models/usersSchema.js";
import bcrypt from "bcrypt";

export const createUser = async ({
    dni,
    fullName,
    phoneNumber,
    email,
    password,
    role,
}) => {
    if (!dni || !fullName || !phoneNumber || !email || !password) {
        const err = new Error("Todos los datos son requeridos");
        err.status = 500;
        throw err;
    }

    const exists = await User.findOne({dni});
    if (exists) {
        const err = new Error("El usuario ya se encuentra registrado");
        err.status = 500;
        throw err;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userCreated = await User.create({
        dni,
        fullName,
        phoneNumber,
        email,
        passwordHash,
        role,
    });

    return userCreated.toJSON();
};
