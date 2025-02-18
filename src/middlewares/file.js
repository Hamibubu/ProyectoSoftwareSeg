const multer = require('multer');
const validExtensions = ['jpg', 'jpeg', 'png'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        //Primer parametro es un error, el segundo la carpeta destino para almacenar los archivos
        cb(null, __dirname + './../../public/uploads');
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop();
        const ts = new Date().getTime();
        const randomString = Math.random().toString(36).substring(2, 15);
        const name = `${randomString}_${ts}.${ext}`;
        cb(null, name);
    }
});

const fileFilter = (req, file, cb) => {
    // const ext = file.originalname.split('.').pop();
    // const isValid = validExtensions.includes(ext);
    const isValid = file.mimetype.startsWith('image/');
    cb(null, isValid);
}

const upload = multer({storage, fileFilter});
module.exports = upload;