const Cart = require('./../models/cart');
const Product = require('./../models/product');



class CartContoller {

    
    listar_carrito(req, res) {
        console.log(`Se solicito obtener la informacion del carrito con id= ${req.params.id}`);
        const  id  = req.params.id;
        console.log(id);
        Cart.findOne({"id": id}).then(c => {
            console.log(`Carrito encontrado es: ${c}`);
            res.json(c);
            //res.sendFile(path.join(__dirname,'./../../public/views/carrito.html'));
        }).catch(e => {
            console.log("Ha ocurrido un error al intentar obtener la informacion del carrito");
            res.send("Ha ocurrido un error al intentar obtener la informacion del carrito");
        })
        
    }

    crear_carrito(user_id){
        const newCart = new Cart({
            id: user_id
        });
        console.log("carrito creado");
        newCart.save();
    }
    
    añadir_producto(req, res) {
        console.log(`PRODUCTOS CARRITO: ${req.body.productId} and ${req.body.userId} & ${req.body.talla}  `);
        Cart.updateOne({"id": req.body.userId}, {$push: {"productos":  req.body.productId }}).then(c => {
            console.log(`Carrito encontrado es: ${c}`);
            res.send(`<script>alert("Item agregado exitosamente al carrito!"); window.location = "/cart/${req.body.userId}";</script>`)
        }).catch(e => {
            console.log("Ha ocurrido un error al intentar obtener la informacion del carrito", e);
            //res.send("Ha ocurrido un error al intentar obtener la informacion del carrito", e);
        })

    }

    borrar_producto(req, res){
        console.log(`productos: ${req.body.productid}`);
        Cart.updateOne({"id": req.body.userid}, { $pull: {"productos": req.body.productid} }).then(c => {
            console.log(`Carrito encontrado es: ${c}`);
            res.send(`<script>alert("Item eliminado exitosamente del carrito!"); window.location = "/cart/${req.body.userid}";</script>`)
        }).catch(e => {
            console.log("Ha ocurrido un error al intentar obtener la informacion del carrito", e);
        })
    }
     
    compra(req, res){
        console.log(`\nCARRITO:  ${req.body.userId}  `);
        Cart.findOne({"id": req.body.userId})
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
            Cart.updateOne({"id": req.body.userId}, { "productos": [] }).then(c => {
                console.log(`Carrito encontrado es: ${c}`);
                res.send(`<script>alert("Compra realizada con exito! Tu pedido llegara lo mas pronto posible!"); window.location = "/";</script>`)
            }).catch(e => {
                console.log("Ha ocurrido un error al intentar obtener la informacion del carrito", e);
                //res.send("Ha ocurrido un error al intentar obtener la informacion del carrito", e);
            })
        });
    }
}

module.exports = new CartContoller();