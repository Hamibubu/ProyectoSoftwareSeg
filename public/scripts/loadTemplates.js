function madeTemplate(data) {
    if(data.length) {
        const container = $('.product-container');
        container.empty();
        data.forEach(dato=>{
            $.get(`/productos/listar_imagen_producto/${dato._id}`)
            .done(function(img) {
                var imgName = img.filename;
                let card = `<div class="${"col-10 col-md-4 col-lg-3 card-container mx-auto mx-md-0"}">
                <div class="${"card mb-3"}">
                    <img src="/assets/uploads/${imgName}" class="card-img-top" alt="...">
                    <div class="${"card-body"}">
                        <h5 class="${"card-title"}">${dato.nombre}</h5><hr>
                        <span><strong>Precio: </strong>$${dato.precio} mxn</span><br>
                        <span class="${"card-text"}"><strong>Marca: </strong>${dato.marca}</span><br>
                        <span class="${"card-text"}"><strong>Genero: </strong>${dato.genero}</span><br>
                        <span class="${"card-text"}"><strong>Categoria: </strong>${dato.categoria}</span><br><br>
                        <a class="${"btn btn-primary product-btn"}" id="${dato.nombre}">Ver más</a>
                    </div>
                </div>
                </div>`
                container.append(card);
            });

        });
    }else{
        $('.product-container').addClass('text-center pt-4').html('<h1>No tenemos productos disponibles...</h1>')
    }
}

function loadData(categories) {
    let postData = (categories == '')?{}:{categoria:categories}
    $.post('/productos', postData)
    .done(function(data){
        madeTemplate(data);
    });
}

