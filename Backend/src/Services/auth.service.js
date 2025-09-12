import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/usersSchema.js";

//Token corto 15 min
const signAccess = (user) => {
    const payload = {
        sub: user._id.toString(),
        role: user.role,
        name: user.name,
    };
    const ttl = `${process.env.ACCESS_TOKEN_TTL_MIN || 15}m`;

    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: ttl });
};

//Token de larga duracion (dias)
const singRefresh = (user) => {
    const payload = {
        sub: user._id.toString(),
        tokenType: "refresh",
    };
    const days = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 7);

    return jwt.sign(payload, process.env.REFRESH_TOKEN_TTL_DAYS, {
        expiresIn: `${days}`,
    });
};

export const registerClient = async ({
    email,
    password,
    fullName,
    dni,
    phoneNumber,
}) => {
    if (!email || !password || !dni || !fullName || !phoneNumber) {
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

export const refreshFromToken = async (refreshToken) => {
    if (!refreshToken) {
        const err = new Error("Falta refresh Token");
        err.status = 401;
        throw err;
    }

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);

    if (payload.tokenType !== "refresh") {
        const err = new Error("token invalido");
        err.status = 401;
        throw err;
    }

    const user = await User.findById(payload.sub).lean();

    if (!user || user.isActive === false) {
        const err = new Error("Usuario no valido");
        err.status = 401;
        throw err;
    }

    return {
        user,
        accessToken: signAccess(user),
        refreshToken: singRefresh(user),
    };
};
