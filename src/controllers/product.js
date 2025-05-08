const Product = require('./../models/product');
const File = require('./../models/file');
const path = require('path');
const fs = require('fs');
const { log } = require('console');

class ProductController {

    ver_producto(req, res) {
        try{
            console.log("Se ha solicitado VER un producto.");
            Product.findById(req.params.id).then(p => {
                console.log(`Tu producto es: ${p}`);
                res.json(p);
            }).catch(e => {
                console.log("Ha ocurrido un error al intentar VER un producto.");
                res.send("Ha ocurrido un error al intentar VER un producto.");
            })
        } catch (err) {
            res.send(500,"Error interno");
        }
    }
    redirect_producto(req, res){
        try{
            const { producto } = req.body;
            console.log('hola vas a ser redirigido ');
            res.redirect('/');
        } catch (err) {
            res.send(500,"Error interno");
        }
    }

    informacion_busqueda(req, res) {
        try {
            const { nombre } = req.body;
    
            // Que sea String

            if (!nombre || typeof nombre !== 'string' || nombre.length > 100) {
                return res.json([]);
            }
    
            // Sanitizado

            const sanitizedNombre = nombre.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    
            Product.find({
                nombre: {
                    $regex: sanitizedNombre,
                    $options: 'i'
                }
            })
            .limit(50)
            .then(response => res.json(response))
            .catch(err => {
                console.error('Error en búsqueda:', err);
                res.status(500).send("Error al buscar productos.");
            });
        } catch (err) {
            console.error('Error interno:', err);
            res.status(500).send("Error interno");
        }
    }
    

    informacion_producto(req, res){
        try{
            const { nombre } = req.body;
            
            if(!nombre || typeof nombre !== 'string'){
                return res.send("Nombre de producto inválido");
            }
            
            const cleanNombre = nombre.replace(/[$\{\}]/g, '');
            
            Product.findOne({nombre: cleanNombre})
              .then(response => {
                  if(!response) return res.send("Producto no encontrado");
                  res.json(response);
              })
              .catch(err => {
                  console.error(err);
                  res.send("Error al buscar producto");
              });
        } catch (err) {
            console.error(err);
            res.send(500, "Error interno");
        }
    }

    listar_productos(req, res) {
        try{
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
        } catch (err) {
            res.send(500,"Error interno");
        }
    }

    listar_productos_index(req, res) {
        try{
            Product.aggregate([{$sample: {size: 3}}])
            .then(response => {
                res.json(response);
            }).catch(err => {
                res.send("Ha ocurrido un error al intentar obtener el listado de productos.", err);
            })
        } catch (err) {
            res.send(500,"Error interno");
        }
    }

    filtrar_productos(req, res) {
        try {
            const { categoria, genero, precio, marca } = req.body;
            let busqueda = {};
        
            // Sanitización para 'categoria'
            if (categoria && typeof categoria === 'string') {
                categoria = categoria.trim().replace(/[^a-zA-Z0-9\s]/g, '');  
                busqueda.categoria = categoria;
            }
    
            // Sanitización para 'genero'
            if (genero && typeof genero === 'string') {
                genero = genero.trim().replace(/[^a-zA-Z0-9\s]/g, ''); 
                busqueda.genero = genero;
            }
    
            // Sanitización para 'precio'
            if (precio && !isNaN(precio)) {
                busqueda.precio = { $lte: parseFloat(precio) };
            }
    
            // Sanitización para 'marca'
            if (marca && typeof marca === 'string') {
                marca = marca.trim().replace(/[^a-zA-Z0-9\s]/g, '');
                busqueda.marca = marca;
            }
    
            if (Object.keys(busqueda).length > 0) {
                Product.find(busqueda).then(response => {
                    res.json(response);
                }).catch(err => {
                    console.error("Error al intentar obtener los productos:", err);
                    res.status(500).send("Ha ocurrido un error al intentar obtener el listado de productos.");
                });
            } else {
                Product.find().then(response => {
                    res.json(response);
                }).catch(err => {
                    console.error("Error al intentar obtener todos los productos:", err);
                    res.status(500).send("Ha ocurrido un error al intentar obtener el listado de productos.");
                });
            }
        } catch (err) {
            console.error("Error interno:", err);
            res.status(500).send("Error interno");
        }
    }
    
    
    listar_productos_por_categoria(req, res) {
        console.log("Se ha solicitado LISTAR POR CATEGORIA.");
    }
    
    crear_productos(req, res) {
        try {
            console.log("Se ha solicitado CREAR un producto.");
    
            var arrTallas = [];
    
            // Validación y sanitización
            const sanitizedCategoria = req.body.categoria.trim().replace(/[^a-zA-Z0-9\s]/g, '');
            const sanitizedMarca = req.body.marca.trim().replace(/[^a-zA-Z0-9\s]/g, '');
            const sanitizedGenero = req.body.genero.trim().replace(/[^a-zA-Z0-9\s]/g, '');
            
            const sanitizedDescripcion = req.body.descripcion.trim().replace(/[^a-zA-Z0-9\s,.\-¿?¡!()]/g, ''); 
    
            const sanitizedNombre = req.body.nombre.trim().replace(/[^a-zA-Z0-9\s]/g, '');
            const sanitizedPrecio = parseFloat(req.body.precio);
            const sanitizedStock = parseInt(req.body.stock);
    
            if (isNaN(sanitizedPrecio) || isNaN(sanitizedStock)) {
                return res.status(400).send('<script>alert("Precio y Stock deben ser números válidos."); window.location = "/admin";</script>');
            }
    
            if (sanitizedCategoria === "" || sanitizedMarca === "" || sanitizedGenero === "" || sanitizedNombre === "") {
                return res.status(400).send('<script>alert("Todos los campos deben ser completados correctamente."); window.location = "/admin";</script>');
            }
    
            // Lógica de tallas
            if (sanitizedCategoria === "Jerseys") {
                const { jerseysXS, jerseysS, jerseysM, jerseysG, jerseysXG } = req.body;
                arrTallas.push(jerseysXS, jerseysS, jerseysM, jerseysG, jerseysXG);
                arrTallas = arrTallas.filter(t => t !== undefined);
    
                if (arrTallas.length === 0) {
                    arrTallas.push("S");
                }
    
            } else if (sanitizedCategoria === "Calzado") {
                const { calzado23, calzado24, calzado25, calzado26, calzado27, calzado28 } = req.body;
                arrTallas.push(calzado23, calzado24, calzado25, calzado26, calzado27, calzado28);
                arrTallas = arrTallas.filter(t => t !== undefined);
    
                if (arrTallas.length === 0) {
                    arrTallas.push("25");
                }
    
            } else {
                arrTallas.push("Talla Única");
            }
    
            const newProduct = new Product({
                nombre: sanitizedNombre,
                precio: sanitizedPrecio,
                stock: sanitizedStock,
                categoria: sanitizedCategoria,
                marca: sanitizedMarca,
                genero: sanitizedGenero,
                descripcion: sanitizedDescripcion,
                tallas: arrTallas
            });
    
            newProduct.save().then(async (p) => {
                const productId = await findProductId(sanitizedNombre, sanitizedPrecio, sanitizedMarca, sanitizedGenero);
    
                if (productId) {
                    File.create({
                        name: req.file.originalname,
                        filename: req.file.filename,
                        productId: productId
                    }).then(response => {
                        console.log(response);
                        res.send('<script>alert("Se ha agregado un producto con todo e imagen!"); window.location = "/admin";</script>');
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
        } catch (err) {
            res.send(500, "Error interno");
        }
    }
    
    
    editar_productos(req, res) {
        try {
            console.log(`\nSe ha solicitado EDITAR el producto [${req.params.id}]`);
    
            var arrTallas = [];
    
            // Sanitización
            const sanitizedCategoria = req.body.categoria.trim().replace(/[^a-zA-Z0-9\s]/g, '');
            const sanitizedMarca = req.body.marca.trim().replace(/[^a-zA-Z0-9\s]/g, '');
            const sanitizedGenero = req.body.generoU.trim().replace(/[^a-zA-Z0-9\s]/g, '');
            const sanitizedDescripcion = req.body.descripcion.trim().replace(/[^a-zA-Z0-9\s,.\-¿?¡!()]/g, ''); 
            const sanitizedNombre = req.body.nombre.trim().replace(/[^a-zA-Z0-9\s]/g, '');
    
            const sanitizedPrecio = parseFloat(req.body.precio);
            const sanitizedStock = parseInt(req.body.stock);
    
            if (isNaN(sanitizedPrecio) || isNaN(sanitizedStock)) {
                return res.status(400).send('<script>alert("Precio y Stock deben ser números válidos."); window.location = "/admin";</script>');
            }
    
            // Lógica para las tallas
            if (sanitizedCategoria === "Jerseys") {
                const { jerseysXS, jerseysS, jerseysM, jerseysG, jerseysXG } = req.body;
                arrTallas.push(jerseysXS, jerseysS, jerseysM, jerseysG, jerseysXG);
                arrTallas = arrTallas.filter(t => t !== undefined);
    
                if (arrTallas.length === 0) {
                    arrTallas.push("S");
                }
    
            } else if (sanitizedCategoria === "Calzado") {
                const { calzado23, calzado24, calzado25, calzado26, calzado27, calzado28 } = req.body;
                arrTallas.push(calzado23, calzado24, calzado25, calzado26, calzado27, calzado28);
                arrTallas = arrTallas.filter(t => t !== undefined);
    
                if (arrTallas.length === 0) {
                    arrTallas.push("25");
                }
    
            } else {
                arrTallas.push("Talla Única");
            }
    
            // Preparar los datos para actualizar
            const updatedInfo = {
                $set: {
                    nombre: sanitizedNombre,
                    precio: sanitizedPrecio,
                    stock: sanitizedStock,
                    categoria: sanitizedCategoria,
                    marca: sanitizedMarca,
                    genero: sanitizedGenero,
                    descripcion: sanitizedDescripcion,
                    tallas: arrTallas
                }
            };
    
            // Actualización del producto
            Product.updateOne({ "_id": req.params.id }, updatedInfo)
                .then(p => {
                    console.log(`\nProducto con _id = ${req.params.id} ha sido ACTUALIZADO correctamente.`);
                    res.send('<script>alert("El producto ha sido ACTUALIZADO correctamente"); window.location = "/admin";</script>');
                })
                .catch(e => {
                    console.log('Ha ocurrido un error al intentar ACTUALIZAR el producto.', e);
                    res.send('<script>alert("Ha ocurrido un error al intentar ACTUALIZAR el producto"); window.location = "/admin";</script>');
                });
    
        } catch (err) {
            console.log("Error interno al editar producto:", err);
            res.send(500, "Error interno");
        }
    }
    
        
    eliminar_productos(req, res) {
        try {
            console.log("\nSe ha solicitado ELIMINAR un producto.");
    
            // Sanitizar el parámetro `id`
            let sanitizedId = req.params.id.trim(); 
            sanitizedId = sanitizedId.replace(/[^0-9a-fA-F]/g, ''); 
    
            // Eliminar la imagen de Uploads
            File.findOne({ productId: sanitizedId }).then(p => {
                if (p) {
                    const fileToDelete = path.join(__dirname, '..', '..', 'public', 'uploads', p.filename);
                    try {
                        fs.unlinkSync(fileToDelete);
                        console.log('La imagen ha sido eliminada de /uploads');
                    } catch (err) {
                        console.log('ERROR EN UNLINK');
                    }
                }
            }).catch(e => {
                console.log("Ha ocurrido un error al intentar eliminar la imagen de uploads.");
            });
    
            // Eliminar imagen de la BD
            File.deleteOne({ "productId": sanitizedId }).then(f => {
                console.log('La imagen ha sido eliminada exitosamente de la base de datos.');
            }).catch(e => {
                console.log('Ha ocurrido un error al intentar eliminar la imagen de la base de datos.');
            });
    
            // Eliminar el producto
            Product.deleteOne({ "_id": sanitizedId }).then(p => {
                console.log(`Producto con _id =  ${sanitizedId} ha sido ELIMINADO correctamente.`);
                res.send('<script>alert("Se ha eliminado el producto exitosamente."); window.location = "/admin";</script>');
            }).catch(e => {
                console.log('Ha ocurrido un error al intentar ELIMINAR el producto.');
                res.send('<script>alert("Ha ocurrido un error al intentar eliminar el producto.\nIntente de nuevo."); window.location = "/admin";</script>');
            });
        } catch (err) {
            console.log("Error interno:", err);
            res.send(500, "Error interno");
        }
    }
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