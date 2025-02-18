$(document).ready(function() {
    $("#sidebarCollapse").on("click", function() {
      $("#sidebar").addClass("active");
    });
  
    $("#sidebarCollapseX").on("click", function() {
      $("#sidebar").removeClass("active");
    });
  
    $("#sidebarCollapse").on("click", function() {
      if ($("#sidebar").hasClass("active")) {
        $(".overlay").addClass("visible");
        console.log("it's working!");
      }
    });
  
    $("#sidebarCollapseX").on("click", function() {
      $(".overlay").removeClass("visible");
    });
});

$(document).ready(function() {
  $('#contenido-navbar').load('/assets/styles/navbar.html', function() {
    function getCookie(name) {
      const cookies = document.cookie.split(';');
      for (const cookie of cookies) {
          const [cookieName, cookieValue] = cookie.trim().split('=');
          if (cookieName === name) {
              return decodeURIComponent(cookieValue);
          }
      }
      return null;
    }

    const token = getCookie('token');
    const btnRegister = document.getElementById("elementos-login-carrito");
    // console.log(`BOTON: ${btnRegister.innerHTML}`);

    if (token !== undefined && token !== null) {
      console.log('User logged with token:', token);
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace("-", "+").replace("_", "/");
      const userRole = JSON.parse(window.atob(base64)).rol;
      const userId = JSON.parse(window.atob(base64))._id;
      
      if (userRole === 'admin') {
        btnRegister.innerHTML = `
        <li class="nav-item" style="display: inline;">
          <button class="btn btn-outline-light btn-cart" disabled><a href="/cart"><i class="fa fa-shopping-cart"></i></a></i></button>
        </li>
        <li class="nav-item" style="display: inline;">
          <a href="/admin" class="navbar-a">
            <button class="btn btn-outline-light btn-register">
              <i class="fa fa-user user-icon"></i>
              <span class="btn-register-text"></span>
            </button>
          </a>
        </li>
        <li class="nav-item" style="display: inline;">
          <a class="navbar-a" onclick="logout()">
            <button class="btn btn-outline-light btn-register">
              <i class="fa fa-close user-icon"></i>
              <span class="btn-register-text"></span>
            </button>
          </a>
        </li>
        `;
      } 
      else {
        btnRegister.innerHTML = `
        <li class="nav-item" style="display: inline;">
          <button class="btn btn-outline-light btn-cart"><a href="/cart/${userId}"><i class="fa fa-shopping-cart"></i></a></i></button>
        </li>
        <li class="nav-item" style="display: inline;">
          <a href="/miperfil/${userId}" id="btnperfil" class="navbar-a">
            <button class="btn btn-outline-light btn-register">
              <i class="fa fa-user user-icon"></i>
              <span class="btn-register-text"></span>
            </button>
          </a>
        </li>
        <li class="nav-item" style="display: inline;">
          <a class="navbar-a" onclick="logout()">
            <button class="btn btn-outline-light btn-register">
              <i class="fa fa-close user-icon"></i>
              <span class="btn-register-text"></span>
            </button>
          </a>
        </li>
        `;
      }

    } else {
      console.log('User is NOT logged.');
    }
  });

});

$(document).ready(function() {
  $('#contenido-footer').load('/assets/styles/footer.html');
});

function logout() {
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  alert("Sesión cerrada exitosamente.")
  window.location = "/";
}