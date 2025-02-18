document.addEventListener('DOMContentLoaded', function() {
    var form = document.getElementById('registerForm');

    form.addEventListener('submit', function(event) {
        var correo = document.getElementById('correo').value;
        var confirmarCorreo = document.getElementById('confirmarCorreo').value;
        var contraseña = document.getElementById('contraseña').value;
        var confirmarContraseña = document.getElementById('confirmarContraseña').value;

        if(correo !== confirmarCorreo && contraseña === confirmarContraseña) {
            alert('Email confirmation does not match.');
            event.preventDefault(); // Prevent form submission
        }
        else if(correo === confirmarCorreo && contraseña !== confirmarContraseña) {
            alert('Password confirmation does not match.');
            event.preventDefault(); // Prevent form submission
        }
        else if (correo !== confirmarCorreo || contraseña !== confirmarContraseña) {
            alert('Email and password confirmation does not match.');
            event.preventDefault(); // Prevent form submission
        }
    });
});
