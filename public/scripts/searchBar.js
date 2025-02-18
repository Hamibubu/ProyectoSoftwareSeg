

$('#contenido-navbar').on('click', '#search-bar-btn', (e)=>{
    e.preventDefault();
    let itemToSearch = $('#search-bar').first().val();
    itemToSearch = capitalizeFirstLetter(itemToSearch);
    
    $.post('/infoproducto', {nombre:itemToSearch} )
    .done(function(data){
        showResults(data);
    }).fail();
});

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function showResults(data) {
    if(data.length) {
        const container = $('#page-content'); 
        container.empty();
        container.append('<div class="lolo">')
        $('.lolo').append('<h2>Resultados<\h2>').append('<hr>');
        
        $('.lolo').append('<div class="row product-container">');
        const subContainer = $('.product-container');
        
        data.forEach(dato=>{
            $.get(`/productos/listar_imagen_producto/${dato._id}`)
            .done(function(img) {
                var imgName = img.filename;
                let card = `
                <div class="${"col-10 col-md-4 col-lg-3 card-container mx-auto mx-md-0"}">
                    <div class="${"card mb-3"}">
                        <img src="/assets/uploads/${imgName}" class="card-img-top" alt="...">
                        <div class="${"card-body pb-2"}">
                            <h5 class="${"card-title"}">${dato.nombre}</h5><hr>
                            <span><strong>Precio: </strong>$${dato.precio} mxn</span><br>
                            <span class="${"card-text"}"><strong>Marca: </strong>${dato.marca}</span><br>
                            <span class="${"card-text"}"><strong>Genero: </strong>${dato.genero}</span><br>
                            <a class="${"btn btn-primary product-btn bm-2"}" id="${dato.nombre}">Ver más</a>
                        </div>
                    </div>
                </div>`
                subContainer.append(card);
            });

        });
    }else{
        $('.product-container').addClass('text-center pt-4').html('<h1>No tenemos productos disponibles...</h1>')
    }
}