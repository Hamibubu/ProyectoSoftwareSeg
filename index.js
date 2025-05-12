const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const csrf = require('csurf');
const upload = multer();
require('dotenv').config();
const session = require('express-session');
const path = require('path');

const app = express();

app.use(session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true
  }));

app.set('view engine', 'ejs');

const routes = require('./src/routes/index');
const port = process.env.PORT || 3001;

app.use('/assets', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
      return res.status(403).send('⛔ Token CSRF inválido o faltante');
    }
    next(err);
  });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname,'public', 'views','index.html'));
});

//Codigo para token (VERIFICAR)
// app.get('/validate', (request, response) => {
//     const token = request.query.token;
//     jwt.verify(token, secretKey, (err, decoded) => {
//         if(err) {
//             response.status(401).send({msg: 'Tu token no es valido.'});
//         } else {
//             response.send(decoded);
//         }
//     });
// })

app.use(routes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'views', 'error.html'));
})

// Conexion a la BD
const mongoUrl = 'mongodb+srv://'+process.env.USER+':'+process.env.PASSWORD+'@'+process.env.HOSTNAME+'/todos?retryWrites=true&w=majority';
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB,
}).then(() => {
    // Correr aplicación por el puerto definido
    app.listen(port, () => {
        console.log(`La aplicacion esta corriendo en el puerto ${port}`);
    });
}).catch(err => {
    // Hubo un error en la conexión de la base de datos
    console.log('No se pudo conectar a la base de datos :(', err);
});