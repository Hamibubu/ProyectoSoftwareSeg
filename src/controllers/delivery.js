const delivery = require('./../models/delivery');
const user = require('./../models/user');

class DeliveryController {
    listUserDeliveryData(req, res) {
        try {
            console.log(`Se solicitó obtener delivery data del usuario con id = ${req.params.id}\n`);
    
            const userId = req.params.id;
    
            // Sanitización: asegura que sea un string plano y no un objeto o valor peligroso
            if (typeof userId !== 'string' || userId.includes('$') || userId.includes('{') || userId.includes('}')) {
                return res.send("Ha ocurrido un error al intentar obtener la informacion del usuario");
            }
    
            delivery.find({ user_id: userId }).then(d => {
                if (d && d.length > 0) {
                    res.json(d);
                } else {
                    console.log('No delivery data found');
                    res.json([]);
                }
            }).catch(e => {
                console.log("Ha ocurrido un error al intentar obtener la informacion del usuario");
                res.send("Ha ocurrido un error al intentar obtener la informacion del usuario");
            });
        } catch (err) {
            res.send(500, "Error interno");
        }
    }    

    crear_datos_entrega(req, res) {
        try {
            console.log(`\nSe solicitó crear datos de entrega para el usuario con id = ${req.body.userId}`);
    
            const sanitize = str => typeof str === 'string' 
                ? str.replace(/[<>'"$]/g, '') 
                : '';
    
            const userId = req.body.userId;
            if (typeof userId !== 'string' || userId.includes('$') || userId.includes('{') || userId.includes('}')) {
                return res.send(`<script>alert("ID de usuario no válido."); window.location = "/login";</script>`);
            }
    
            const newDelivery = new delivery({
                calle: sanitize(req.body.calle),
                numero: sanitize(req.body.numero),
                colonia: sanitize(req.body.colonia),
                ciudad: sanitize(req.body.ciudad),
                estado: sanitize(req.body.estado),
                referencias: req.body.referencias ? sanitize(req.body.referencias) : "No se agregaron referencias",
                user_id: userId
            });

            const safeUserId = String(req.body.userId).replace(/["'\\]/g, c => '\\' + c);
    
            newDelivery.save()
            .then(d => {
                console.log(`Se agregaron exitosamente los nuevos datos de entrega!`);
                res.send(`<script>alert("Se agregaron exitosamente los nuevos datos de entrega!"); window.location = "/miperfil/${safeUserId}";</script>`);
            })
            .catch(e => {
                console.log(`Ha ocurrido un error agregando los datos de entrega.`);
                res.send(`<script>alert("Ha ocurrido un error agregando los datos de entrega."); window.location = "/miperfil/${safeUserId}";</script>`);
            });
    
        } catch (err) {
            res.send(500, "Error interno");
        }
    }    

    eliminar_datos_entrega(req, res) {
        try {
            console.log(`\nSe solicito eliminar datos de entrega con id = ${req.body.deliveryId} del usuario con id = ${req.body.userId}`);
    
            // Sanitización
            const safeDeliveryId = String(req.body.deliveryId).replace(/["'\\]/g, c => '\\' + c);
            const safeUserId = String(req.body.userId).replace(/["'\\]/g, c => '\\' + c);
    
            // Procedemos a eliminar los datos de entrega
            delivery.deleteOne({ "_id": safeDeliveryId })
                .then(d => {
                    console.log(`Se han eliminado los datos de entrega exitosamente!`);
                    res.send(`<script>alert("Se han eliminado los datos de entrega exitosamente!"); window.location = "/miperfil/${safeUserId}";</script>`);
                })
                .catch(e => {
                    console.log(`Ha ocurrido un error al intentar eliminar los datos de entrega.`);
                    res.send(`<script>alert("Ha ocurrido un error al intentar eliminar los datos de entrega."); window.location = "/miperfil/${safeUserId}";</script>`);
                })
        } catch (err) {
            res.send(500, "Error interno");
        }
    }
    
}

module.exports = new DeliveryController();