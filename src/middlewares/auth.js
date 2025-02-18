const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
    jwt.verify(req.cookies.token, process.env.SECRET_KEY, (err, decoded) => {
        if(err) {
            res.status(401).send('<script>alert("Inicia sesión para realizar esta acción."); window.location = "/";</script>');
        } else {
            req.user = decoded;
            next();
        }
    });
}

module.exports = authMiddleware;