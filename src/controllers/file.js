const File = require('./../models/file');

class FileController {
    
    listar_imagenes(req, res) {
        File.find().sort({productId: 1}).then(p => {
            res.json(p);
        }).catch(e => {
            res.send("Ha ocurrido un error al intentar obtener el listado de imagenes.");
        })
    }

    listar_imagen_producto(req, res) {
        File.findOne({productId: req.params.id}).then(p => {
            res.json(p);
        }).catch(e => {
            res.send("Ha ocurrido un error al intentar obtener el listado de imagenes.");
        })
    }
}

module.exports = new FileController();