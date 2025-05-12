const router = require('express').Router();
const usuariosController = require('./../controllers/user');
const productosController = require('./../controllers/product');
const carritoController = require('./../controllers/cart');
const filesController = require('./../controllers/file');
const noticiasController = require('./../controllers/noticias');
const deliveryController = require('./../controllers/delivery');
const file = require('./../middlewares/file');
const authMiddleware = require('./../middlewares/auth');
const roleMiddleware = require('./../middlewares/role')
const path = require('path');
const csrf = require('csurf');

const csrfProtection = csrf({ cookie: false });

// =============================================
// RUTAS DE VISTAS (HTML)
// =============================================

// Vistas de autenticación
router.get('/login', csrfProtection, (req, res) => {
    res.render('login', { csrfToken: req.csrfToken() });
});

router.get('/terminos', (req, res) => {
    res.sendFile(path.join(__dirname,'./../../public/views/terminos.html'));
});

// Vistas de perfil de usuario
router.get('/miperfil/:id', csrfProtection, authMiddleware, (req, res) => {
    res.render('miperfil', { csrfToken: req.csrfToken() });
});

// Vistas de administración
router.get('/admin', csrfProtection, authMiddleware, roleMiddleware, (req, res) => {
    res.render('admin', { csrfToken: req.csrfToken() });
});

// Vistas de productos
router.get('/productos', (req, res) => {
    res.sendFile(path.join(__dirname,'./../../public/views/productos.html'));
});

router.get('/productos/Producto', csrfProtection, (req, res) => {
    res.render('Producto', { csrfToken: req.csrfToken() });
});

router.get('/productos/accesorios', (req, res) => {
    res.sendFile(path.join(__dirname,'./../../public/views/accesorios.html'));
});

router.get('/productos/jerseys', (req, res) => {
    res.sendFile(path.join(__dirname,'./../../public/views/jerseys.html'));    
});

router.get('/productos/calzados', (req, res) => {
    res.sendFile(path.join(__dirname,'./../../public/views/calzado.html'));
});

// Vistas de carrito
router.get('/cart', csrfProtection, authMiddleware, (req, res) => {
    res.render('carrito', { csrfToken: req.csrfToken() });
});

router.get('/cart/:id', csrfProtection, authMiddleware, (req, res) => {
    res.render('carrito', { csrfToken: req.csrfToken() });
});

// Otras vistas
router.get('/noticias', (req, res) => {
    res.sendFile(path.join(__dirname,'./../../public/views/noticias.html'));    
});

router.get('/about_us', (req, res) => {
    res.sendFile(path.join(__dirname,'./../../public/views/aboutUs.html'));    
});

// =============================================
// RUTAS DE API (CONTROLADORES)
// =============================================

// Rutas de autenticación y usuarios
router.post('/login/crear_usuario', csrfProtection, usuariosController.crear_usuario);
router.post('/login/iniciar_sesion', csrfProtection, usuariosController.login_usuario);
router.get('/miperfil/userinformation/:id', authMiddleware, usuariosController.listUserInformation);
router.post('/about_us', usuariosController.createComment);

// Rutas de productos
router.post('/productos', productosController.listar_productos);
router.post('/productos_index', productosController.listar_productos_index);
router.post('/productosfiltrados', productosController.filtrar_productos);
router.post('/productos/producto', productosController.informacion_producto);
router.post('/infoproducto', productosController.informacion_busqueda);
router.get('/productos', productosController.listar_productos);

// Rutas de administración de productos
router.get('/admin/ver_producto/:id', authMiddleware, roleMiddleware, productosController.ver_producto);
router.get('/admin/listar_productos', authMiddleware, roleMiddleware, productosController.listar_productos);
router.post('/admin/crear_producto', file.single('file'), csrfProtection, authMiddleware, roleMiddleware, productosController.crear_productos);
router.post('/admin/editar_producto/:id', file.single('fileU'), csrfProtection, authMiddleware, roleMiddleware, productosController.editar_productos);
router.post('/admin/eliminar_producto/:id', csrfProtection, authMiddleware, roleMiddleware, productosController.eliminar_productos);

// Rutas de imágenes
router.get('/productos/listar_imagen_producto/:id', filesController.listar_imagen_producto);
router.get('/admin/listar_imagenes', authMiddleware, roleMiddleware, filesController.listar_imagenes);
router.get('/admin/listar_imagen_producto/:id', authMiddleware, roleMiddleware, filesController.listar_imagen_producto);

// Rutas de carrito
router.get('/cart/content/:id', authMiddleware, carritoController.listar_carrito);
router.post('/cart/addProductToCart', csrfProtection, authMiddleware, carritoController.añadir_producto);
router.post('/cart/buy', csrfProtection, authMiddleware, carritoController.compra);
router.post('/cart/delete/:id', csrfProtection, authMiddleware, carritoController.borrar_producto);
router.get('/cart/ver_producto/:id', authMiddleware, productosController.ver_producto);

// Rutas de delivery
router.get('/miperfil/deliveryinformation/:id', authMiddleware, deliveryController.listUserDeliveryData);
router.post('/miperfil/crear_datos_de_entrega', csrfProtection, authMiddleware, deliveryController.crear_datos_entrega);
router.post('/miperfil/eliminar_datos_de_entrega', csrfProtection, authMiddleware, deliveryController.eliminar_datos_entrega);

// Rutas de noticias
router.get('/showNoticias', noticiasController.get_noticias);

module.exports = router;