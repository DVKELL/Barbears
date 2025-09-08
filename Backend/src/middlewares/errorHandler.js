export default (err, _req, res, _next) => {
    const status = err.status || 500;
    res.status(status).json({
        message: err.message || "Ha ocurrido un error interno",
    });
};
