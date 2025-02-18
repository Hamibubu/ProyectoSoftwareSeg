
function habilitarCheckboxes(opt) {
    var categoriaSelect, initialcontainer, tallasJerseysContainer, tallasCalzadoContainer, tallasAccesoriosContainer;
    if (opt === 'C') {
        categoriaSelect = document.getElementById("selectCategoria");
        initialcontainer = document.getElementById("initial-container");
        tallasJerseysContainer = document.getElementById("tallas-jerseys-container");
        tallasCalzadoContainer = document.getElementById("tallas-calzado-container");
        tallasAccesoriosContainer = document.getElementById("tallas-accesorios-container");

    } else if (opt === 'U') {
        categoriaSelect = document.getElementById("selectCategoriaU");
        initialcontainer = document.getElementById("initial-containerU");
        tallasJerseysContainer = document.getElementById("tallas-jerseys-containerU");
        tallasCalzadoContainer = document.getElementById("tallas-calzado-containerU");
        tallasAccesoriosContainer = document.getElementById("tallas-accesorios-containerU");
    }

    initialcontainer.style.display = "none";    
    var categoriaSeleccionada = categoriaSelect.value;

    // Habilitar el contenedor de tallas correspondiente
    if (categoriaSeleccionada === "Jerseys") {
        tallasJerseysContainer.style.display = "block";
        tallasCalzadoContainer.style.display = "none";
        tallasAccesoriosContainer.style.display = "none";

    } else if (categoriaSeleccionada === "Calzado") {
        tallasJerseysContainer.style.display = "none";
        tallasCalzadoContainer.style.display = "block";
        tallasAccesoriosContainer.style.display = "none";

    } else if (categoriaSeleccionada === "Accesorios") {
        tallasJerseysContainer.style.display = "none";
        tallasCalzadoContainer.style.display = "none";
        tallasAccesoriosContainer.style.display = "block";
    }
}


function openModalUpdate(productId, productName) {  
    fetch(`/admin/ver_producto/${productId}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.getElementById('updateModalProductName').innerText = `[${productName}]`;
        document.getElementById('txtNombreU').placeholder = data.nombre;
        document.getElementById('txtPrecioU').placeholder = data.precio;
        document.getElementById('txtStockU').placeholder = data.stock;
        document.getElementById('txtDescripcionU').placeholder = data.descripcion;
        document.getElementById('txtNombreU').value = data.nombre;
        document.getElementById('txtPrecioU').value = data.precio;
        document.getElementById('txtStockU').value = data.stock;
        document.getElementById('txtDescripcionU').value = data.descripcion;
        const selectCategoria = document.getElementById('selectCategoriaU').options;
        for (let i = 1; i < selectCategoria.length; i++) {
            if (selectCategoria[i].value === data.categoria) {
                selectCategoria[i].selected = true;
                break;
            } 
        }
        habilitarCheckboxes('U');  
        const selectMarca = document.getElementById('selectMarcaU').options;
        for (let i = 1; i < selectMarca.length; i++) {
            if (selectMarca[i].value === data.marca) {
                selectMarca[i].selected = true;
                break;
            } 
        }
        const genderRadios = document.getElementsByName('generoU');
        for (let i = 0; i < genderRadios.length; i++) {
            if(genderRadios[i].value === data.genero) {
                genderRadios[i].checked = true;
                break;
            }
        }

        const checkboxOptions = document.getElementsByClassName("checkboxOption")
        for (let i = 0; i < checkboxOptions.length; i++) {
            if (data.tallas.includes(checkboxOptions[i].value)) {
                checkboxOptions[i].checked = true;
            } else {
                checkboxOptions[i].checked = false;
            }
        }

    }).catch(e => {
        console.log("No se ha podido mostrar la información del producto en cada input.");
    })

    const updateForm = document.getElementById('modifyForm');
    updateForm.action = '/admin/editar_producto/'+productId;
}

function openModalDelete(productId, productName) {
    document.getElementById('deleteModalProductName').innerText = productName;

    const deleteForm = document.getElementById('deleteForm');
    deleteForm.action = '/admin/eliminar_producto/'+productId;
    $('#deleteModal').modal('show');
}

