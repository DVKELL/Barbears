import User from "../models/usersSchema.js";
import bcrypt from "bcryptjs";
import { signAccess } from "./auth.service.js";
import { signRefresh } from "./auth.service.js";

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
        err.status = 422;
        throw err;
    }

    const exists = await User.findOne({ dni });
    if (exists) {
        const err = new Error("El usuario ya se encuentra registrado");
        err.status = 409;
        throw err;
    }

    const existsEmail = await User.findOne({ email });
    if (existsEmail) {
        const err = new Error("El usuario ya se encuentra registrado");
        err.status = 409;
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

    const accessToken = signAccess(userCreated);
    const refreshToken = signRefresh(userCreated);

    return { user: userCreated.toJSON(), accessToken, refreshToken };
};
