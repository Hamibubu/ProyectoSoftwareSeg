const roleMiddleware = (req, res, next) => {
    if (req.user.rol === 'user') {
        console.log("No tienes permisos para visualizar este apartado.");
        res.status(401).send('<script>alert("No cuentas con los permisos para acceder a este apartado."); window.location = "/";</script>');
    }
    next();
}
module.exports = roleMiddleware;