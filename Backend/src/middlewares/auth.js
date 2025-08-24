//Si no existe una sesion creada con las cookies, se retorna al usuario a otra pagina
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
