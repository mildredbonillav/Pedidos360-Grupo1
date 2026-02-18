let empresa_id = sessionStorage.getItem("empresa_id");
const urlParams = new URLSearchParams(window.location.search);
const usuario_id = parseInt(urlParams.get('usuario_id')) || 0;

$(function () {
    usuarios_Roles_Load();

    if (usuario_id > 0) {
        usuarios_UpdateMode();
        usuarios_Select();
    }

    //quitar error cuando el usuario corrige
    $(document).on("input change", "input, select, textarea", function () {
        $(this).removeClass("is-invalid");
        $("#err_" + this.id).text("");
    });
});

function usuarios_UpdateMode() {
    $("#lblTitle").text("Editar usuario");
    $("#lblSubtitle").text("Actualice la información del usuario");

    $("#divPasswordCreate").addClass("d-none").hide();
    $("#divPasswordEdit").removeClass("d-none").show();
}

//Función para agregar un usuario nuevo
function usuarios_Usuarios_Insert() {

    // Si estás usando la validación inline que hicimos
    if (typeof usuarios_validateForm === "function") {
        if (!usuarios_validateForm()) return;
    }

    document.getElementById("btnSave").disabled = true;

    let usuarioData = {
        empresa_id: empresa_id,
        cedula: $("#txtcedula").val().trim(),
        nombre: $("#txtnombre").val().trim(),
        apellidos: $("#txtapellidos").val().trim(),
        correo: $("#txtcorreo").val().trim(),
        contrasena: $("#txtcontrasena").val(),
        telefono: $("#txttelefono").val().trim(),
        direccion: $("#txtdireccion").val().trim(),
        rol_id: parseInt($("#slcrol").val() || 0)
    };

    const sUsuario = JSON.stringify(usuarioData);

    const token = $('input[name="__RequestVerificationToken"]').val();

    $.ajax({
        url: '/Usuarios/Usuarios_Insert', 
        type: 'POST',
        data: {
            __RequestVerificationToken: token,
            pUsuario: sUsuario
        },
        success: function (response) {

            document.getElementById("btnSave").disabled = false;

            response = (response || "").replace(/\(Parameter 'Original'\)/g, '');

            if (response === "") {
                site_showAlert("Éxito", "Usuario guardado correctamente.", "success");
                setTimeout(() => {
                    window.location.href = "/Usuarios/Usuarios_Index";
                }, 800);
            } else {
                site_showAlert("Error", response, "error");
            }
        },
        error: function () {
            document.getElementById("btnSave").disabled = false;
            site_showAlert("Error", "Error al guardar los datos. SP: Usuarios_Insert", "error");
        }
    });
}

//Carga la lista de roles
function usuarios_Roles_Load() {

    var thas_erroren = $('[name=__RequestVerificationThas_erroren]').val();

    $.ajax({
        url: '/Usuarios/Roles_Load',
        type: 'POST',
        data: { __RequestVerificationThas_erroren: thas_erroren, empresa_id },
        success: function (d) {
            if (site_isJson(d)) {
                var data = JSON.parse(d);
                site_loadCombo('#slcrol', data, 'rol_id', 'nombre');
            } else {
                d = d.replace(/\(Parameter 'Original'\)/g, "");
                site_showAlert("Error", d.replace(/\(Parameter 'Original'\)/g, ""), "error");

            }
        },
        error: function () {
            site_showAlert("Error", "Error al obtener datos. SP: Roles_Load", "error");
        }
    });
}


function usuarios_Save() {

    if (usuarios_Valida()) return;

    if (usuario_id > 0) {
        usuarios_Usuarios_Update();
    } else {
        usuarios_Usuarios_Insert();
    }
}

function usuarios_Valida() {

    site_clearValidation();

    const val = (id) => $.trim($("#" + id).val());
    const isEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    var has_error = false;

    // ======================
    // GENERALES
    // ======================

    if (!val("txtcedula")) {
        site_setError("txtcedula", "Ingrese la cédula");
        has_error = true;
    }

    if (!val("txtnombre")) {
        site_setError("txtnombre", "Ingrese el nombre");
        has_error = true;
    }

    if (!val("txtapellidos")) {
        site_setError("txtapellidos", "Ingrese los apellidos");
        has_error = true;
    }

    let correo = val("txtcorreo");
    if (!correo) {
        site_setError("txtcorreo", "Ingrese el correo");
        has_error = true;
    } else if (!isEmail(correo)) {
        site_setError("txtcorreo", "Correo inválido");
        has_error = true;
    }

    if (!val("txttelefono")) {
        site_setError("txttelefono", "Ingrese el teléfono");
        has_error = true;
    }

    if (!val("txtdireccion")) {
        site_setError("txtdireccion", "Ingrese la dirección");
        has_error = true;
    }

    if (!val("slcrol")) {
        site_setError("slcrol", "Seleccione un rol");
        has_error = true;
    }

    // ======================
    // PASSWORDS
    // ======================

    if (usuario_id === 0) {
        // CREATE
        let p = val("txtcontrasena");
        let c = val("txtconfirmar");

        if (!p) {
            site_setError("txtcontrasena", "Ingrese la contraseña");
            has_error = true;
        } else if (p.length < 6) {
            site_setError("txtcontrasena", "Mínimo 6 caracteres");
            has_error = true;
        }

        if (!c) {
            site_setError("txtconfirmar", "Confirme la contraseña");
            has_error = true;
        } else if (p !== c) {
            site_setError("txtconfirmar", "Las contraseñas no coinciden");
            has_error = true;
        }
    }
    else {
        // EDIT
        let actual = val("txtactual");
        let nueva = val("txtnueva");
        let conf = val("txtconfirmarNueva");

        let quiereCambiar = actual || nueva || conf;

        if (quiereCambiar) {

            if (!actual) {
                site_setError("txtactual", "Ingrese la contraseña actual");
                has_error = true;
            }

            if (!nueva) {
                site_setError("txtnueva", "Ingrese la nueva contraseña");
                has_error = true;
            } else if (nueva.length < 6) {
                site_setError("txtnueva", "Mínimo 6 caracteres");
                has_error = true;
            }

            if (!conf) {
                site_setError("txtconfirmarNueva", "Confirme la nueva contraseña");
                has_error = true;
            } else if (nueva !== conf) {
                site_setError("txtconfirmarNueva", "No coincide");
                has_error = true;
            }
        }
    }

    if (has_error) site_focusFirstError();

    return has_error;
}
function usuarios_Select() {

    const token = $('input[name="__RequestVerificationToken"]').val();

    $.ajax({
        url: '/Usuarios/Usuarios_Select',
        type: 'POST',
        data: {
            __RequestVerificationToken: token,
            empresa_id: empresa_id,
            usuario_id: usuario_id
        },
        success: function (d) {

            if (!site_isJson(d)) {
                d = (d || "").replace(/\(Parameter 'Original'\)/g, "");
                site_showAlert("Error", d, "error");
                return;
            }

            const data = JSON.parse(d);

            if (!data || data.length === 0) {
                site_showAlert("Información", "No se encontró el usuario.", "info");
                return;
            }

            const u = data[0];

            $("#txtcedula").val(u.cedula || "");
            $("#txtnombre").val(u.nombre || "");
            $("#txtapellidos").val(u.apellidos || "");
            $("#txtcorreo").val(u.correo || "");
            $("#txttelefono").val(u.telefono || "");
            $("#txtdireccion").val(u.direccion || "");

            // Rol por empresa (según tu SP Select)
            if (u.rol_id !== undefined && u.rol_id !== null) {
                $("#slcrol").val(u.rol_id);
            }

        },
        error: function () {
            site_showAlert("Error", "Error al obtener datos. SP: Usuarios_Select", "error");
        }
    });
}
function usuarios_Usuarios_Update() {

    // Valida primero
    if (usuarios_Valida()) return;

    document.getElementById("btnSave").disabled = true;

    // Si quiere cambiar password (solo en update)
    const actual = $("#txtactual").val().trim();
    const nueva = $("#txtnueva").val().trim();
    const conf = $("#txtconfirmarNueva").val().trim();

    const cambiarContrasena = (actual !== "" || nueva !== "" || conf !== "");

    let usuarioData = {
        empresa_id: empresa_id,
        usuario_id: usuario_id,
        cedula: $("#txtcedula").val().trim(),
        nombre: $("#txtnombre").val().trim(),
        apellidos: $("#txtapellidos").val().trim(),
        correo: $("#txtcorreo").val().trim(),
        telefono: $("#txttelefono").val().trim(),
        direccion: $("#txtdireccion").val().trim(),
        rol_id: parseInt($("#slcrol").val() || 0),
        contrasena_actual: actual,
        contrasena: nueva,
        cambiar_contrasena: cambiarContrasena
    };

    const sUsuario = JSON.stringify(usuarioData);
    const token = $('input[name="__RequestVerificationToken"]').val();

    $.ajax({
        url: '/Usuarios/Usuarios_Update',
        type: 'POST',
        data: {
            __RequestVerificationToken: token,
            pUsuario: sUsuario
        },
        success: function (response) {

            document.getElementById("btnSave").disabled = false;

            response = (response || "").replace(/\(Parameter 'Original'\)/g, '');

            if (response === "") {
                site_showAlert("Éxito", "Usuario actualizado correctamente.", "success");
                setTimeout(() => {
                    window.location.href = "/Usuarios/Usuarios_Index";
                }, 800);
            } else {
                site_showAlert("Error", response, "error");
            }
        },
        error: function () {
            document.getElementById("btnSave").disabled = false;
            site_showAlert("Error", "Error al actualizar los datos. SP: Usuarios_Update", "error");
        }
    });
}
