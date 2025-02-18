$('#sendMessage').on('click', (e)=>{
    e.preventDefault();
    let message = $('#message').first();
    let email =$('#email').first();
    let name = $('#name').first();

    $.post('/about_us',{
        mensaje:message.val(),
        correo:email.val(),
        nombre:name.val()
    }).done(function(data){
        message.val('');
        email.val('');
        name.val('');
        console.log(data.state)
        if(data.state){
            alert("Se ha enviado correctamente");
        }
    }).fail(function(data){
        alert('Ha ocurrido un error en el envío');
    });
})  