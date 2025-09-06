//Si no existe una sesion creada con las cookies, se retorna al usuario a otra pagina

export function devAuth(req, _, next) {
    if (process.env.DEV_FAKE_AUTH === "1") {
        const id = req.header("user-x-id");
        const role = req.header("user-x-role") || "CLIENTE";

        if (id) req.user = { _id: id, role };
    }
    next();
}

/*
export const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.send("Redireccionar, debe tener una sesion creada");
    }
    next();
};

//Si no es administrador
export const requireAdmin = (req, res, next) => {
    if (!req.session.user || req.session.role !== "admin") {
        return res.send("Redireccionar, debe ser un administrador");
    }
    next();
};

*/
