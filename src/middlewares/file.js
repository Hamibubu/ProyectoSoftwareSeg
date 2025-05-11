const multer = require('multer');
const path = require('path');

const validExtensions = ['.jpg', '.jpeg', '.png'];

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/uploads'));
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const ts = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const name = `${randomString}_${ts}${ext}`;
        cb(null, name);
    }
});

const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const isMimeValid = file.mimetype.startsWith('image/');
    const isExtValid = validExtensions.includes(ext);

    if (isMimeValid && isExtValid) {
        cb(null, true);
    } else {
        cb(new Error('Archivo no permitido. Solo se permiten imágenes JPG, JPEG o PNG.'));
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
