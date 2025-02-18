const User = require('./../models/user');
const contactUs = require('./../models/contacto');
const Delivery = require('./../models/delivery');
const jwt = require('jsonwebtoken');
const cart = require('./../controllers/cart');
require('dotenv').config();

class UserController {
    login_usuario(req, res) {
        console.log('Se solicito iniciar sesión.');
        const {correo, contraseña} = req.body;
        
        User.findOne({correo, contraseña})
            .then(response => {
                if (response) {
                    const {_id, correo, rol} = response;
                    console.log(`La secretKey es = ${process.env.SECRET_KEY}`);
                    const token = jwt.sign({_id, correo, rol}, process.env.SECRET_KEY);
                    console.log(`El token de usuario es: ${token}`);
                    res.cookie('token',token);

                    if (response.rol === 'admin') {
                        res.redirect('/admin');
                    } else {
                        res.redirect('/');
                    }

                } else {
                    console.log("El usuario no existe");
                    res.status(400).send('<script>alert("Usuario y/o contraseña no validos. Intente de nuevo."); window.location = "/login";</script>');
                }
            })
            .catch(error => {
                console.log("Login error: ", error);
                res.status(400).send('<script>alert("Sucedio un error al intentar iniciar sesión. Intente de nuevo."); window.location = "/login";</script>');
            })
    }

    crear_usuario(req, res) {
        console.log('Se solicito crear un usuario.');
        const {nombre, apellido, telefono, correo, contraseña} = req.body;

        User.findOne({correo})
        .then(response => {
            if (response) {
                res.send(`<script>alert("Ya existe un usuario registrado con ese usuario. Inicie sesión o crea otra cuenta."); window.location = "/login";</script>`);
            } else {
                const newUser = new User({
                    nombre: nombre,
                    apellido: apellido,
                    correo: correo,
                    telefono: telefono || 'No agregado',
                    contraseña: contraseña
                })
                
                //Se manda el usuario a mongoDB
                newUser.save()
                .then(() => {
                    //se obtiene el id y se llama la función de crear carrito.
                    console.log(newUser._id);
                    cart.crear_carrito(newUser._id);
                    console.log('Nuevo Usuario: ', newUser);
                    res.send(`<script>alert("Tu usuario ha sido creado exitosamente! Ahora inicia sesión."); window.location = "/";</script>`);
                    
                })
                .catch(() => {
                    res.send(`<script>alert("Ha ocurrido un error al intentar crear tu usuario. Intenta de nuevo."); window.location = "/login";</script>`);
                });
            }
        })
        .catch(e => {
            res.send(`<script>alert("Ha ocurrido un error al intentar verificar tu usuario. Intenta de nuevo."); window.location = "/login";</script>`);
        })
    }

    createComment(req, res){
        const { mensaje, correo, nombre } = req.body;
        const contactRecord = new contactUs({
            mensaje:mensaje,
            correo: correo,
            nombre:nombre
        });
        contactRecord.save().then(()=>{
            res.json({state:true});
        }).catch((err)=>{
            console.log('an error has ocurred:', err);
            res.json({state:false, err});
        });
    }

    listUserInformation(req, res) {
        console.log(`Se solicito obtener la informacion del usuario con id = ${req.params.id}`);
        const _id = req.params.id;
        User.findById(_id).then(p => {
            console.log(`usuario encontrado es: ${p}`);
            res.json(p);
        }).catch(e => {
            console.log("Ha ocurrido un error al intentar obtener la informacion del usuario");
            res.send("Ha ocurrido un error al intentar obtener la informacion del usuario");
        })
    }
}

module.exports = new UserController();