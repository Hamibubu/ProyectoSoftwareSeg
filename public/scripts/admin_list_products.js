fetch('/admin/listar_productos').then(response => response.json())
.then(data => {
    const cardRow = document.getElementById('cardRow');
    var indx = 0;

    data.forEach(product => {    
        fetch(`/admin/listar_imagen_producto/${product._id}`)
        .then(response => response.json())
        .then(img => {
            var cardContainer = document.createElement('div');
            cardContainer.className = 'col-12 col-md-6 col-lg-3 card-container';
            cardContainer.innerHTML = `
                <div class="card" data-product-id="${product._id}">
                    <img src="/assets/uploads/${img.filename}" alt="Image not found." class="card-img-top" alt="...">
                    <div class="card-body" id="cardBody">
                        <h5 class="card-title">${product.nombre}</h5>
                        <span><i>$${product.precio} mxn</i></span><br>
                        <span><b>Stock:</b> ${product.stock}</span><br>
                        <span><b>Categoria:</b> ${product.categoria}</span><hr>
                        <button class="btn-admin-cards btn-modify" data-toggle="modal" data-target="#modifyModal" onclick="openModalUpdate('${product._id}', '${product.nombre}')">
                            <i class="fa fa-edit" style="margin-right: 5px;"></i>Modificar
                        </button>
                        <button class="btn-admin-cards btn-delete" data-toggle="modal" data-target="#deleteModal" onclick="openModalDelete('${product._id}', '${product.nombre}')">
                            <i class="fa fa-trash" style="margin-right: 5px;"></i>Eliminar
                        </button>
                    </div>
                </div>
            `;
            cardRow.appendChild(cardContainer);
            indx++;
        })


    });

})
.catch(error => {
    console.error('Error showing products from database.', error);
});

// fetch('/admin/listar_productos').then(response => response.json())
//     .then(data => {
//         const cardRow = document.getElementById('cardRow');

//         fetch('/admin/listar_imagenes')
//             .then(response => response.json())
//             .then(imgs => {
//                 var indx = 0;
//                 data.forEach(product => {
                    
//                     var imgName = '';
//                     fetch(`/admin/listar_imagen_producto/`)
//                     .then(response => response.json())
//                     .then(img => {
//                         imgName = img.filename;
//                     })

//                     var cardContainer = document.createElement('div');
//                     cardContainer.className = 'col-12 col-md-6 col-lg-3 card-container';
//                     cardContainer.innerHTML = `
//                         <div class="card" data-product-id="${product._id}">
//                             <img src="/assets/uploads/${imgs[indx].filename}" class="card-img-top" alt="...">
//                             <div class="card-body" id="cardBody">
//                                 <h5 class="card-title">${product.nombre}</h5>
//                                 <span><i>$${product.precio} mxn</i></span><br>
//                                 <span><b>Stock:</b> ${product.stock}</span><br>
//                                 <span><b>Categoria:</b> ${product.categoria}</span><hr>
//                                 <button class="btn-admin-cards btn-modify" data-toggle="modal" data-target="#modifyModal" onclick="openModalUpdate('${product._id}', '${product.nombre}')">
//                                     <i class="fa fa-edit" style="margin-right: 5px;"></i>Modificar
//                                 </button>
//                                 <button class="btn-admin-cards btn-delete" data-toggle="modal" data-target="#deleteModal" onclick="openModalDelete('${product._id}', '${product.nombre}')">
//                                     <i class="fa fa-trash" style="margin-right: 5px;"></i>Eliminar
//                                 </button>
//                             </div>
//                         </div>
//                     `;
//                     cardRow.appendChild(cardContainer);
//                     indx++;
//                 });
//             })
//             .catch(err => {
//                 console.log("Error showing the images from the database.", err);
//             })        
//     })
//     .catch(error => {
//         console.error('Error showing products from database.', error);
//     });


