const User = require('./../models/user');
const contactUs = require('./../models/contacto');
const Delivery = require('./../models/delivery');
const jwt = require('jsonwebtoken');
const cart = require('./../controllers/cart');
const bcrypt = require('bcrypt')
require('dotenv').config();

class UserController {
    login_usuario(req, res) {
        try {
            console.log('Se solicito iniciar sesión.');
            const { correo, contraseña } = req.body;
    
            // Validación básica
            if (!correo || !contraseña) {
                return res.status(400).send('<script>alert("Correo y contraseña son requeridos."); window.location = "/login";</script>');
            }
    
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,3}$/;
            if (!emailRegex.test(correo)) {
                return res.status(400).send('<script>alert("Por favor ingresa un correo electrónico válido."); window.location = "/login";</script>');
            }

            // Buscar al usuario por correo
            User.findOne({ correo })
                .then(response => {
                    if (response) {
                        // Verificar la contraseña hasheada con bcrypt
                        bcrypt.compare(contraseña, response.contraseña, (err, isMatch) => {
                            if (err) {
                                console.log("Error al comparar las contraseñas:", err);
                                return res.status(400).send('<script>alert("Sucedió un error al intentar iniciar sesión. Intente de nuevo."); window.location = "/login";</script>');
                            }
    
                            if (isMatch) {
                                // Las contraseñas coinciden
                                const { _id, correo, rol } = response;
                                const token = jwt.sign({ _id, correo, rol }, process.env.SECRET_KEY);
                                res.cookie('token', token, {
                                    sameSite: 'lax',         
                                    secure: true,          
                                    maxAge: 24 * 60 * 60 * 1000, 
                                    path: '/',           
                                  });                                  
    
                                if (response.rol === 'admin') {
                                    res.redirect('/admin');
                                } else {
                                    res.redirect('/');
                                }
                            } else {
                                console.log("Contraseña incorrecta.");
                                res.status(400).send('<script>alert("Usuario y/o contraseña no validos. Intente de nuevo."); window.location = "/login";</script>');
                            }
                        });
                    } else {
                        console.log("El usuario no existe");
                        res.status(400).send('<script>alert("Usuario y/o contraseña no validos. Intente de nuevo."); window.location = "/login";</script>');
                    }
                })
                .catch(error => {
                    console.log("Login error: ", error);
                    res.status(400).send('<script>alert("Sucedio un error al intentar iniciar sesión. Intente de nuevo."); window.location = "/login";</script>');
                });
        } catch (err) {
            console.log("Error interno en login:", err);
            res.send(500, "Error interno");
        }
    }

    crear_usuario(req, res) {
        try {
            console.log('Se solicitó crear un usuario.');
            let { nombre, apellido, telefono, correo, contraseña } = req.body;

            // -------- Validación y sanitización --------
            const sanitize = (str) => String(str || '')
                .trim()
                .replace(/[<>'"$\\{}]/g, '');

            nombre = sanitize(nombre);
            apellido = sanitize(apellido);
            telefono = sanitize(telefono || 'No agregado');
            correo = sanitize(correo).toLowerCase();
            contraseña = String(contraseña || '').trim();

            // Validar formato de email básico
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(correo)) {
                return res.send(`<script>alert("Correo inválido. Intenta con uno válido."); window.location = "/login";</script>`);
            }

            // Validar campos requeridos
            if (!nombre || !apellido || !correo || !contraseña) {
                return res.send(`<script>alert("Todos los campos requeridos deben ser completados."); window.location = "/login";</script>`);
            }

            // -------- Búsqueda segura --------
            User.findOne({ correo: correo })
            .then(response => {
                if (response) {
                    res.send(`<script>alert("Ya existe un usuario registrado con ese correo. Inicia sesión o usa otro."); window.location = "/login";</script>`);
                } else {
                    // -------- Hashear la contraseña --------
                    bcrypt.hash(contraseña, 10, (err, hashedPassword) => {
                        if (err) {
                            return res.send(`<script>alert("Error al procesar tu contraseña. Intenta de nuevo."); window.location = "/login";</script>`);
                        }

                        const newUser = new User({
                            nombre,
                            apellido,
                            correo,
                            telefono,
                            contraseña: hashedPassword
                        });

                        newUser.save()
                        .then(() => {
                            cart.crear_carrito(newUser._id);
                            console.log('Nuevo Usuario:', newUser);
                            res.send(`<script>alert("Tu usuario ha sido creado exitosamente. Ahora inicia sesión."); window.location = "/";</script>`);
                        })
                        .catch(() => {
                            res.send(`<script>alert("Error al crear tu usuario. Intenta de nuevo."); window.location = "/login";</script>`);
                        });
                    });
                }
            })
            .catch(() => {
                res.send(`<script>alert("Error al verificar tu usuario. Intenta de nuevo."); window.location = "/login";</script>`);
            });
        } catch (err) {
            res.send(500, "Error interno");
        }
    }


    createComment(req, res){
        try{
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
        } catch (err) {
            res.send(500,"Error interno");
        }
    }

    listUserInformation(req, res) {
        try{
            console.log(`Se solicito obtener la informacion del usuario con id = ${req.params.id}`);
            const _id = req.params.id;
            const hexOnlyRegex = /^[a-fA-F0-9]+$/;
            if (!hexOnlyRegex.test(_id)) {
                return res.status(400).send("ID de usuario inválido");
            }
            if (_id !== req.user._id){
                res.send(401, "No estas autorizado");
                return;
            }
            User.findById(_id).then(p => {
                console.log(`usuario encontrado es: ${p}`);
                res.json(p);
            }).catch(e => {
                console.log("Ha ocurrido un error al intentar obtener la informacion del usuario");
                res.send(500,"Error interno");
            })
        } catch (err) {
            res.send(500,"Error interno");
        }
    }
}

module.exports = new UserController();