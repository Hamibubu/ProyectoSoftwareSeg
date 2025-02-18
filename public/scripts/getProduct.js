$('#page-content').on('click', '.product-btn', function() {
    let productId = $(this).attr('id').trim();
    $.get("/productos/producto")
    .done(function(productPage){
        $('body').html(productPage);
        $.post('/productos/producto', {nombre:productId})
        .done(function(data){
            const listTemplate = $('#header-template').first();
            const template = Handlebars.compile(listTemplate.html());
            $.get(`/productos/listar_imagen_producto/${data._id}`)
            .done(function(img) {
                let resultHTML = template({
                    nombre:data.nombre,
                    precio:data.precio,
                    stock:data.stock,
                    descripcion:data.descripcion,
                    id:data.nombre,
                    id2:data._id,
                    talla: data.tallas,
                    imagen: img.filename
                });
                $('#page-content').append(resultHTML);
            });
        }).fail(function(){
            console.log('Ha ocurrido un error');
        });
    }).fail(function(){
        console.log('No se ha podido mostrar el contenido')
    });
});

