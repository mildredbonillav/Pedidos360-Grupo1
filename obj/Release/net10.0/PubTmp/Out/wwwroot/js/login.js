
$(function () {

});


//Validar incio de sesion

function login_Usuarios_Valida_Inicio_Sesion() {
    var token = $('[name=__RequestVerificationToken]').val();

    let UsuarioData = {
        correo: document.getElementById("txtcorreo").value.trim(),
        contrasena: document.getElementById("txtcontrasena").value
    };

    if (!UsuarioData.correo || !UsuarioData.contrasena) {
        site_showAlert(
            "Información",
            "Debe ingresar correo y contraseña.",
            "info"
        );
        return;
    }

    $.ajax({
        url: '/Security/Usuarios_Valida_Inicio_Sesion',
        type: 'POST',
        data: {
            __RequestVerificationToken: token,
            pUsuario: UsuarioData
        },
        success: function (d) {

            if (site_isJson(d)) {

                var data = JSON.parse(d);

                // No tiene acceso a ninguna empresa
                if (data.length === 0) { 
                    site_showAlert(
                        "Acceso denegado",
                        "No tiene empresas asignadas. Contacte a su administrador.",
                        "warning"
                    );
                    return;
                }

                // Guardar usuario base
                sessionStorage.setItem("usuario_id", data[0].usuario_id);
                sessionStorage.setItem("usuario_nombre", data[0].nombre);

                // SOLO UNA empresa
                if (data.length === 1) {

                    sessionStorage.setItem("empresa_id", data[0].empresa_id);
                    sessionStorage.setItem("empresa_nombre", data[0].empresa_nombre);

                    sessionStorage.setItem("rol_id", data[0].rol_id);
                    sessionStorage.setItem("rol_nombre", data[0].rol_nombre);
                    window.location.href = "/Home/Index";
                    return;
                }

                // VARIAS empresas (cada una con su rol)
                sessionStorage.setItem(
                    "empresas_disponibles",
                    JSON.stringify(data)
                );

                window.location.href = "/Security/Select_Company";
            }
            else {
                site_showAlert(
                    "Error",
                    d,
                    "error"
                );
            }


        },
        error: function () {
            site_showAlert(
                "Error",
                "Error al validar inicio de sesión.",
                "error"
            );
        }
    });
}
