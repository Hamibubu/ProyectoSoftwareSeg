const express  = require('express');
const mongoose = require('mongoose');
const app = express();
const multer = require('multer');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const upload = multer();
require('dotenv').config();
const path = require('path');

const routes = require('./src/routes/index');
const port = process.env.PORT || 3001;

app.use('/assets', express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

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
const mongoUrl = 'mongodb+srv://total_sport_user:total_sport_user@test.mygbwdt.mongodb.net/todos?retryWrites=true&w=majority';
mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'total_sport_db',
}).then(() => {
    // Correr aplicación por el puerto definido
    app.listen(port, () => {
        console.log(`La aplicacion esta corriendo en el puerto ${port}`);
    });
}).catch(err => {
    // Hubo un error en la conexión de la base de datos
    console.log('No se pudo conectar a la base de datos :(', err);
});