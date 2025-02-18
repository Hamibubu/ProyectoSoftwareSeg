$(document).ready(function() {
    const href = window.location.pathname.split("/");
    const id = href[href.length - 1];

    fetch(`/miperfil/userinformation/${id}`)
    .then(response => response.json())
    .then(userData => {
            const informationContainer = document.getElementById('userinformationContainer');
            informationContainer.innerHTML = `
                <h3>Datos de Usuario</h3>
                <div class="containerUserData">
                    <span class="data" id="nombreCompleto"><b>Nombre: </b>${userData.nombre + ' ' + userData.apellido}</span><br>
                    <span class="data" id="correo"><b>Correo electrónico: </b>${userData.correo}</span><br>
                    <span class="data" id="telefono"><b>Telefono: </b>${userData.telefono}</span><br>
                </div>
            `;
        })
        .catch(error => {
            console.error('Error showing products from database.', error);
        });

    fetch(`/miperfil/deliveryinformation/${id}`)
    .then(response => response.json())
    .then(data => {
            const deliveryinformationContainer = document.getElementById('containerDeliveryId');
            if (data.length !== 0) {
                data.forEach(e => {
                    var deliverydata = document.createElement('div');   
                    deliverydata.className =  "deliveryData-container";
                    deliverydata.innerHTML = `
                        <span class="data"><b>Calle: </b>${e.calle + " #" + e.numero}</span><br>
                        <span class="data"><b>Colonia: </b>${e.colonia}</span><br>
                        <span class="data"><i>${e.ciudad + ", "+e.estado}</i></span><br>
                        <span class="data"><b>Referencias: </b>${e.referencias}</span><br>
                        <div class="deleteData-container">
                                <button type="submit" class="btn-modal btn-modal-delete" data-toggle="modal" data-target="#deleteModal" onclick="deleteDeliveryData('${e._id}', '${id}')">
                                    Eliminar<i class="fa fa-trash" style="margin-left: 5px;"></i>
                                </button>
                            </form>
                        </div>
                    `;
                    deliveryinformationContainer.appendChild(deliverydata);
                });
            } else {
                var deliverydata = document.createElement('div');   
                deliverydata.className =  "deliveryData-container";
                deliverydata.innerHTML = `<span class="data">No hay datos de entrega agregados.</span>`
                deliveryinformationContainer.appendChild(deliverydata);
            }

        })
        .catch(error => {
            console.error('Error showing products from database.', error);
        });

    document.getElementById('txtUserId').value = id;    
});
    
    
function deleteDeliveryData(deliveryId, userId) {
    document.getElementById('txtDeliveryIdDelete').value = deliveryId;
    document.getElementById('txtUserIdDelete').value = userId;
}
