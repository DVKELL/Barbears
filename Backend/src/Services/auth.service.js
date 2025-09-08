import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/usersSchema.js";

const signAccess = (user) => {
    const payload = {
        sub: user._id.toString(),
        role: user.role,
        name: user.name,
    };
    const ttl = `${process.env.ACCESS_TOKEN_TTL_MIN || 15}m`;

    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: ttl });
};

export const registerClient = async ({
    name,
    email,
    password,
    fullName,
    dni,
    phoneNumber,
}) => {
    if (!name || !email || !password || !dni || !fullName || !phoneNumber) {
        const err = new Error("Nombre, correo y contraseña son requeridos");
        err.status = 422;
        throw err;
    }

    const exists = await User.findOne({ email });
    if (exists) {
        const err = new Error("Usuario ya registrado");
        err.status = 409;
        throw err;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        email,
        passwordHash,
        role: "CLIENT",
        phoneNumber,
        fullName,
        dni,
    });

    const accessToken = signAccess(user);

    return { user: user.toJSON(), accessToken };
};

export const loginClient = async ({ email, password }) => {
    if (!email || !password) {
        const err = new Error("El correo y la contraseña son requeridos");
        err.status = 422;
        throw err;
    }

    const user = await User.findOne({ email, role: "CLIENT", isActive: true });
    if (!user) {
        const err = new Error("Usuario no encontrado");
        err.status = 401;
        throw err;
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
        const err = new Error("Contraseña invalida");
        err.status = 401;
        throw err;
    }

    const accessToken = signAccess(user);


    return { user: user.toJSON(), accessToken };
};
