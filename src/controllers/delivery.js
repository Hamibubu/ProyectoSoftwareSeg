const delivery = require('./../models/delivery');
const user = require('./../models/user');

class DeliveryController {
    listUserDeliveryData(req, res) {
        console.log(`Se solicito obtener delivery data del usuario con id = ${req.params.id}\n`);

        delivery.find({user_id : req.params.id}).then(d => {
            if (d && d.length > 0) {
                // console.log('DELIVERY DATA: ', d);
                res.json(d);
            } else {
                console.log('No delivery data found');
                res.json([]);
            }
        }).catch(e => {
            console.log("Ha ocurrido un error al intentar obtener la informacion del usuario");
            res.send("Ha ocurrido un error al intentar obtener la informacion del usuario");
        })
    }

    crear_datos_entrega(req, res) {
        console.log(`\nSe solicito crear datos de entrega para el usuario con id = ${req.body.userId}`);

        const newDelivery = new delivery({
            calle: req.body.calle,
            numero: req.body.numero,
            colonia: req.body.colonia,
            ciudad: req.body.ciudad,
            estado: req.body.estado,
            referencias: req.body.referencias ? req.body.referencias : "No se agregaron referencias",
            user_id: req.body.userId
        })

        newDelivery.save()
        .then(d => {
            console.log(`Se agregaron exitosamente los nuevos datos de entrega!`);
            res.send(`<script>alert("Se agregaron exitosamente los nuevos datos de entrega!"); window.location = "/miperfil/${req.body.userId}";</script>`);
            
        })
        .catch(e => {
            console.log(`Ha ocurrido un error agregando los datos de entrega.`);
            res.send(`<script>alert("Ha ocurrido un error agregando los datos de entrega."); window.location = "/miperfil/${req.body.userId}";</script>`);
        })

    }

    eliminar_datos_entrega(req, res) {
        console.log(`\nSe solicito eliminar datos de entrega con id = ${req.body.deliveryId} del usuario con id = ${req.body.userId}`);
        delivery.deleteOne({"_id" : req.body.deliveryId})
        .then(d => {
            console.log(`Se han eliminado los datos de entrega exitosamente!`);
            res.send(`<script>alert("Se han eliminado los datos de entrega exitosamente!"); window.location = "/miperfil/${req.body.userId}";</script>`);
            
        })
        .catch(e => {
            console.log(`Ha ocurrido un error al intentar eliminar los datos de entrega.`);
            res.send(`<script>alert("Ha ocurrido un error al intentar eliminar los datos de entrega."); window.location = "/miperfil/${req.body.userId}";</script>`);
        })
    }
}

module.exports = new DeliveryController();