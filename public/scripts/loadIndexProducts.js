let template = $('#product-element').first();
const container = $('#items-container');
template = Handlebars.compile(template.html());


$.post('/productos_index', {})
.done(function(data){
    let reducedData = [data[0] , data[1] , data[2]] 
    reducedData.forEach(datos => {
        $.get(`/productos/listar_imagen_producto/${datos._id}`)
        .done(function(img) {
            let resultHTML = template({
                nombre:datos.nombre,
                precio:datos.precio,
                stock:datos.stock,
                id:datos.nombre,
                imagen: img.filename
            });
            container.append(resultHTML);
        });
    });
});
