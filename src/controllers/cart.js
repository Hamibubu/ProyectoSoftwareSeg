const Cart = require('./../models/cart');
const Product = require('./../models/product');



class CartContoller {

    listar_carrito(req, res) {
        try {
            console.log(`Se solicitó obtener la información del carrito con id= ${req.params.id}`);
            
            // Sanitización
            const id = String(req.params.id).replace(/[^a-zA-Z0-9]/g, '');
    
            if (id !== req.user._id){
                res.send(401, "No estas autorizado");
                return;
            }

            // Realiza la búsqueda en la base de datos
            Cart.findOne({ "id": id }).then(c => {
                if (c) {
                    console.log(`Carrito encontrado:`, c);
                    res.json(c);
                } else {
                    console.log("Carrito no encontrado");
                    res.send(404, "Carrito no encontrado.");
                }
            }).catch(e => {
                console.log("Ha ocurrido un error al intentar obtener la información del carrito", e);
                res.send(500,"Error interno");
            });
        } catch (err) {
            console.log("Error interno:", err);
            res.send(500,"Error interno");
        }
    }
    

    crear_carrito(user_id){
        try{
            const newCart = new Cart({
                id: user_id
            });
            console.log("carrito creado");
            newCart.save();
        } catch (err) {
            res.send(500,"Error interno");
        }
    }
    
    añadir_producto(req, res) {
        try {
            // Sanitize inputs to prevent any NoSQL Injection
            const userId = String(req.body.userId).replace(/[^a-zA-Z0-9]/g, ''); 
            const productId = String(req.body.productId).replace(/[^a-zA-Z0-9]/g, ''); 
    
            if (userId !== req.user._id){
                res.send(401, "No estas autorizado");
                return;
            }

            console.log(`PRODUCTOS CARRITO: ${productId} and ${userId} & ${req.body.talla}`);
    
            // Ahora utilizamos los valores sanitizados en la consulta
            Cart.updateOne({ "id": userId }, { $push: { "productos": productId } })
                .then(c => {
                    console.log(`Carrito actualizado con éxito: ${c}`);
                    res.send(`<script>alert("Item agregado exitosamente al carrito!"); window.location = "/cart/${userId}";</script>`);
                })
                .catch(e => {
                    console.log("Ha ocurrido un error al intentar agregar el producto al carrito", e);
                    res.status(500).send('<script>alert("Ha ocurrido un error al intentar agregar el producto al carrito."); window.location = "/cart";</script>');
                });
        } catch (err) {
            console.log("Error interno:", err);
            res.status(500).send("Error interno");
        }
    }
    

    borrar_producto(req, res) {
        try {
            // Sanitizar
            const userId = String(req.body.userid).replace(/[^a-zA-Z0-9]/g, '');
            const productId = String(req.body.productid).replace(/[^a-zA-Z0-9]/g, '');
    
            if (userId !== req.user._id){
                res.send(401, "No estas autorizado");
                return;
            }

            console.log(`productos: ${productId}`);
    
            // Usamos los valores sanitizados para realizar la consulta
            Cart.updateOne({ "id": userId }, { $pull: { "productos": productId } })
                .then(c => {
                    console.log(`Carrito actualizado: ${c}`);
                    res.send(`<script>alert("Item eliminado exitosamente del carrito!"); window.location = "/cart/${userId}";</script>`);
                })
                .catch(e => {
                    console.log("Ha ocurrido un error al intentar eliminar el producto del carrito", e);
                    res.status(500).send('<script>alert("Ha ocurrido un error al intentar eliminar el producto del carrito."); window.location = "/cart";</script>');
                });
        } catch (err) {
            console.log("Error interno:", err);
            res.status(500).send("Error interno");
        }
    }
    
     
    compra(req, res){
        try{
            console.log(`\nCARRITO:  ${req.body.userId}  `);
            const userId = String(req.body.userId).replace(/[^a-zA-Z0-9]/g, '');
            if (userId !== req.user._id){
                res.send(401, "No estas autorizado");
                return;
            }
            Cart.findOne({"id": userId})
            .then(c => {
                console.log(`Carroooooo: ${c}`);
                //Restamos uno a cada stock
                (c.productos).forEach(p => {
                    Product.updateOne({"_id": p}, {$inc: {"stock": -1} }).then(p => {
                        console.log(p);
                    }).catch(e => {
                        console.log("Ha ocurrido un error al intentar obtener la informacion del producto", e);
                    });               
                });
                
                //Borrar los contenidos del carrito
                Cart.updateOne({"id": userId}, { "productos": [] }).then(c => {
                    console.log(`Carrito encontrado es: ${c}`);
                    res.send(`<script>alert("Compra realizada con exito! Tu pedido llegara lo mas pronto posible!"); window.location = "/";</script>`)
                }).catch(e => {
                    console.log("Ha ocurrido un error al intentar obtener la informacion del carrito", e);
                    //res.send("Ha ocurrido un error al intentar obtener la informacion del carrito", e);
                })
            });
        } catch (err) {
            res.send(500,"Error interno");
        }
    }
}

module.exports = new CartContoller();