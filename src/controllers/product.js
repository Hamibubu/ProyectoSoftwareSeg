const Product = require('./../models/product');
const File = require('./../models/file');
const path = require('path');
const fs = require('fs');
const { log } = require('console');

class ProductController {

    ver_producto(req, res) {
        console.log("Se ha solicitado VER un producto.");
        Product.findById(req.params.id).then(p => {
            console.log(`Tu producto es: ${p}`);
            res.json(p);
        }).catch(e => {
            console.log("Ha ocurrido un error al intentar VER un producto.");
            res.send("Ha ocurrido un error al intentar VER un producto.");
        })
    }
    redirect_producto(req, res){
        const { producto } = req.body;
        console.log('hola vas a ser redirigido');
        res.redirect('/');
    }

    informacion_busqueda(req, res){
        const { nombre } = req.body;
        console.log(nombre);
        Product.find({nombre: {$regex:`${nombre}`}}).then(response => {
            res.json(response);
        }).catch(err => {
            res.send("Ha ocurrido un error al intentar obtener el listado de productos.", err);
        });
    }

    informacion_producto(req, res){
        const { nombre } = req.body;
        Product.findOne({nombre}).then(response => {
            res.json(response);
        }).catch(err => {
            res.send("Ha ocurrido un error al intentar obtener el listado de productos.", err);
        });
    }

    listar_productos(req, res) {
        const { categoria } = req.body;
        if(categoria){
            Product.find({categoria}).then(response => {
                res.json(response);
            }).catch(err => {
                res.send("Ha ocurrido un error al intentar obtener el listado de productos.", err);
            })
        } else {
            Product.find().then(response => {
                res.json(response);
            }).catch(err => {
                res.send("Ha ocurrido un error al intentar obtener el listado de productos.", err);
            })
        }
    }

    listar_productos_index(req, res) {
        Product.aggregate([{$sample: {size: 3}}])
        .then(response => {
            res.json(response);
        }).catch(err => {
            res.send("Ha ocurrido un error al intentar obtener el listado de productos.", err);
        })
    }

    filtrar_productos(req, res) {
        const { categoria, genero, precio, marca} = req.body;
        let busqueda = {};
        if(categoria){
            busqueda.categoria = categoria;
        }
        if(genero){
            busqueda.genero = genero;
        }
        if(precio){
            busqueda.precio = {$lte:precio};
        }
        if(marca){
            busqueda.marca = marca;
        }
        if(Object.keys(busqueda).length){
            Product.find(busqueda).then(response => {
                res.json(response);
            }).catch(err => {
                res.send("Ha ocurrido un error al intentar obtener el listado de productos.", err);
            })
        }else{
            Product.find().then(response => {
                res.json(response);
            }).catch(err => {
                res.send("Ha ocurrido un error al intentar obtener el listado de productos.", err);
            })
        }
        
    }
    
    listar_productos_por_categoria(req, res) {
        console.log("Se ha solicitado LISTAR POR CATEGORIA.");
    }
    
    crear_productos(req, res) {
        console.log("Se ha solicitado CREAR un producto.");
        
        var arrTallas = [];
        if (req.body.categoria === "Jerseys") {
            const {jerseysXS, jerseysS, jerseysM, jerseysG, jerseysXG} = req.body;
            arrTallas.push(jerseysXS, jerseysS, jerseysM, jerseysG, jerseysXG);
            arrTallas = arrTallas.filter(t => t !== undefined);
            
            if (arrTallas.length === 0) {
                arrTallas.push("S");
            }

        } else if (req.body.categoria === "Calzado") {
            const {calzado23, calzado24, calzado25, calzado26, calzado27, calzado28} = req.body;
            arrTallas.push(calzado23, calzado24, calzado25, calzado26, calzado27, calzado28);
            arrTallas = arrTallas.filter(t => t !== undefined);

            if (arrTallas.length === 0) {
                arrTallas.push("25");
            }

        } else {
            arrTallas.push("Talla Única");
        }

        const newProduct = new Product({
            nombre: req.body.nombre,
            precio: req.body.precio,
            stock: req.body.stock,
            categoria: req.body.categoria,
            marca: req.body.marca,
            genero: req.body.genero,
            descripcion: req.body.descripcion,
            tallas: arrTallas
        });

        newProduct.save().then(async (p) => {
            const productId = await findProductId(req.body.nombre, req.body.precio, req.body.marca, req.body.genero);
            
            if (productId) {
                File.create({
                    name: req.file.originalname,
                    filename: req.file.filename,
                    productId: productId
                }).then(response => {
                    console.log(response);
                    res.send('<script>alert("Se ha agregado un producto con todo e imagen!"); window.location = "/admin";</script>')
                }).catch(err => {
                    console.log('ERROR en upload_file');
                    const fileToDelete = path.join(__dirname, '..', '..', 'uploads', req.file.filename);
                    fs.unlinkSync(fileToDelete);
                    res.status(400).send(`<script>alert("Se ha agregado un nuevo producto exitosamente pero su imagen no."); window.location = "/admin";</script>`);
                })
            }
        }).catch(e => {
            console.log("Ha ocurrido un error al intentar AGREGAR un producto nuevo.");
            res.send(`<script>alert("Ha ocurrido un error al intentar AGREGAR un producto nuevo."); window.location = "/admin";</script>`);
        })
    }
    
    editar_productos(req, res) {
        console.log(`\nSe ha solicitado EDITAR el producto [${req.params.id}]`);

        var arrTallas = [];
        if (req.body.categoria === "Jerseys") {
            const {jerseysXS, jerseysS, jerseysM, jerseysG, jerseysXG} = req.body;
            arrTallas.push(jerseysXS, jerseysS, jerseysM, jerseysG, jerseysXG);
            arrTallas = arrTallas.filter(t => t !== undefined);
            
            if (arrTallas.length === 0) {
                arrTallas.push("S");
            }

        } else if (req.body.categoria === "Calzado") {
            const {calzado23, calzado24, calzado25, calzado26, calzado27, calzado28} = req.body;
            arrTallas.push(calzado23, calzado24, calzado25, calzado26, calzado27, calzado28);
            arrTallas = arrTallas.filter(t => t !== undefined);

            if (arrTallas.length === 0) {
                arrTallas.push("25");
            }

        } else {
            arrTallas.push("Talla Única");
        }
        const updatedInfo = {
            $set: {
            nombre: req.body.nombre,
            precio: req.body.precio,
            stock: req.body.stock,
            categoria: req.body.categoria,
            marca: req.body.marca,
            genero: req.body.generoU,
            descripcion: req.body.descripcion,
            tallas: arrTallas
            }      
        };

        Product.updateOne({"_id" : req.params.id}, updatedInfo)
        .then(p => {
            console.log(`\nProducto con _id =  ${req.params.id} ha sido ACTUALIZADO correctamente.`);
            res.send('<script>alert("El producto ha sido ACTUALIZADO correctamente"); window.location = "/admin";</script>');
        }).catch(e => {
            console.log('Ha ocurrido un error al intentar ACTUALIZAR el producto.');            
            res.send('<script>alert("Ha ocurrido un error al intentar ACTUALIZAR el producto"); window.location = "/admin";</script>');
        })
    }
    
    eliminar_productos(req, res) {
        console.log("\nSe ha solicitado ELIMINAR un producto.");

        // Eliminar la imagen de Uploads
        File.findOne({productId: req.params.id}).then(p => {
            const fileToDelete = path.join(__dirname, '..', '..', 'public', 'uploads', p.filename);
            try {
                fs.unlinkSync(fileToDelete);
                console.log('La imagen ha sido eliminada de /uploads');
            } catch (err) {
                console.log('ERROR EN UNLINk');
            }
        }).catch(e => {
            console.log("Ha ocurrido un error al intentar eliminar la imagen de uploads.");
        })

        // Eliminar imagen de la BD
        File.deleteOne({"productId": req.params.id}).then(f => {
            console.log('La imagen ha sido eliminada exitosamente de la base de datos.');
        }).catch(e => {
            console.log('Ha ocurrido un error al intentar eliminar la imagen de la base de datos.');
        })


        // Eliminar el producto
        Product.deleteOne({"_id" : req.params.id}).then(p => {
            console.log(`Producto con _id =  ${req.params.id} ha sido ELIMINADO correctamente.`);
            res.send('<script>alert("Se ha eliminado el producto exitosamente."); window.location = "/admin";</script>');
        }).catch(e => {
            console.log('Ha ocurrido un error al intentar ELIMINAR el producto.');            
            res.send('<script>alert("Ha ocurrido un error al intentar eliminar el producto.\nIntente de nuevo."); window.location = "/admin";</script>');
        })
    }

    // upload_file(req, res) {
    //     console.log("\nSe subira un archivo para determinado producto.");
    //     console.log('File: ', req.file);

    //     if (!req.file) {
    //         res.status(400).send({message: "File not supported!"});
    //         return;
    //     }

    //     console.log('Todo bien!');
    //     File.create({
    //         name: req.file.originalname,
    //         filename: req.file.filename,
    //         productId: req.params.id
    //     }).then(response => {
    //         console.log(response);
    //         // res.send('<script>alert("ALERT"); window.location = "/admin";</script>')
    //     }).catch(err => {
    //         console.log('ERROR en upload_file');
    //         const fileToDelete = path.join(__dirname, '..', '..', 'uploads', req.file.filename);
    //         fs.unlinkSync(fileToDelete);
    //         // res.status(400).send(err);
    //     })
    // }
}

async function findProductId(nombre, precio, marca, genero) {
    return Product.findOne({nombre: nombre, precio: precio, marca: marca, genero: genero})
    .then(p => {
        if (p) {
            return p._id;
        }
        return null;
    })
    .catch(e => {
        console.log("No se encontro producto con esos datos.");
        return null;
    })
}

module.exports = new ProductController();