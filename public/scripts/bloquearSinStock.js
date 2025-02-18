function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

delay(750).then(() => {
    const availableStock = document.getElementById('stockText').textContent;
    console.log('Stock info: ',availableStock);
    const btnAgregarCarrito = document.getElementById('btnAgregarCarrito');
    const btnFinalizarCompra = document.getElementById('btnFinalizarCompra');

    if (availableStock < 1) {
        btnAgregarCarrito.disabled = true;
        btnFinalizarCompra.disabled = true;
    } else {
        btnAgregarCarrito.disabled = false;
        btnFinalizarCompra.disabled = false;
    }
});