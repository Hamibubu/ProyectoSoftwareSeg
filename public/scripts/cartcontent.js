$(document).ready(function() {
    const href = window.location.pathname.split("/");
    const id = href[href.length - 1];
    console.log(id);

    fetch(`/cart/content/${id}`)
    .then(response => response.json())
    .then(cartData => {
        console.log('aaaaa');


        const prdCounts = {};
        var productos= [];

        cartData.productos.forEach(prd => {
            prdCounts[prd] = (prdCounts[prd] || 0) + 1;
            productos.push(prd);
        });
        
        function removewithfilter(arr) {
            let outputArray = arr.filter(function (v, i, self) {
         
                // It returns the index of the first
                // instance of each value
                return i == self.indexOf(v);
            });
         
            return outputArray;
        }
        productos = removewithfilter(productos);

        productos.forEach(p => {
            console.log(p);
            console.log('cuenta');
            console.log(prdCounts[p]);
            
            fetch(`/cart/ver_producto/${p}`)
            .then(response => response.json())
            .then(data => {
            console.log(data);
            $.get(`/productos/listar_imagen_producto/${data._id}`)
            .done(function(img) {
                console.log('file name;',img.filename);
                var precioReal = data.precio * prdCounts[p];
                const csrfToken = document.querySelector('input[name="_csrf"]').value;
                const productsContainerText = `
    
                <div class="row border-top border-bottom">
                    <div class="row main align-items-center">
                        <div class="col-2"><img class="img-fluid" src="/assets/uploads/${img.filename}"></div>
                        <div class="col">
                            <div class="row">${data.nombre}</div>
                            <div class="row text-muted">${data.descripcion}</div>
                        </div>
                        <div class="col">
                            <a href="#" class="border">${prdCounts[p]}</a>
                        </div>
                        <div class="col div-precio-producto" id="precioReal_${p}">$ ${precioReal} mxn<form class="formd" action="/cart/delete/${id}" method="POST">
                                <button class="discreto"><span class="close">&#10005;</span></button>
                                <input type="hidden" name="_csrf" value="${csrfToken}">
                                <input type="hidden" id="productid" name="productid" value="${p}">
                                <input type="hidden" id="userid" name="userid" value="${id}">
                            </form>  
                        </div>
                    </div>
                </div>
                `;
    
    
                $("#productos").append(productsContainerText);
                })
            });
        });
            
        })
        .catch(error => {
            console.log('a');
            console.error('Error showing products from database.', error);
        });

    })