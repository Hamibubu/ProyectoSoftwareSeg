function updatePrices() {
    
    console.log("\n\nENTRA A ACTUALIZAR PRECIOS");
    let itemTotalPrice = 0;

    document.querySelectorAll('.col.div-precio-producto').forEach(item => {
        const itemId = item.id.split('_')[1]
        const productPrice = parseFloat(document.getElementById(`precioReal_${itemId}`).textContent.replace('$', '')) || 0; // Obtén el precio del producto        
        console.log(`Item id: ${itemId}`);
        console.log(`Precio del producto: ${productPrice}`);
        itemTotalPrice += productPrice; // Agrega el precio total al precio total general
    });

    // Actualiza el precio total general
    // document.querySelector('.summary .row:last-child .col.text-right').textContent = `$ ${totalPrice.toFixed(2)} mxn`;
    document.getElementById('precioItems').textContent = `$ ${itemTotalPrice.toFixed(2)} mxn`;
    if (itemTotalPrice === 0) {
        precioTotalCarrito = itemTotalPrice;
    }
    else {
        precioTotalCarrito = itemTotalPrice + 250;
    }
    document.getElementById('precioTotalCarrito').textContent = `$ ${precioTotalCarrito.toFixed(2)} mxn`;
}


document.addEventListener('DOMContentLoaded', () => {
    function delay(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }
    delay(1000).then(() => updatePrices());
});