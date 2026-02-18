let empresa_id = sessionStorage.getItem("empresa_id");
const urlParams = new URLSearchParams(window.location.search);
const cliente_id = parseInt(urlParams.get('cliente_id')) || 0;

// cache de tipos cedula para obtener mascara por id
let tiposCedulaCache = [];

$(function () {

    clientes_TiposCedulas_Load();

    if (cliente_id > 0) {
        clientes_UpdateMode();
        clientes_Select();
    }

    // quitar error cuando el usuario corrige
    $(document).on("input change", "input, select, textarea", function () {
        $(this).removeClass("is-invalid");
        $("#err_" + this.id).text("");
    });

    // cuando cambia el tipo de cédula => actualizar máscara
    $(document).on("change", "#slctipocedula", function () {
        clientes_ApplyCedulaMask();
    });

    // al escribir en cédula => formatear según máscara (si hay)
    $(document).on("input", "#txtcedula", function () {
        clientes_FormatCedulaOnInput();
    });
});

function clientes_UpdateMode() {
    $("#lblTitle").text("Editar cliente");
    $("#lblSubtitle").text("Actualice la información del cliente");
}

function clientes_Save() {

    if (clientes_Valida()) return;

    if (cliente_id > 0) {
        clientes_Update();
    } else {
        clientes_Insert();
    }
}

function clientes_Valida() {

    site_clearValidation();

    const val = (id) => $.trim($("#" + id).val());
    const isEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    let has_error = false;

    if (!val("slctipocedula")) {
        site_setError("slctipocedula", "Seleccione el tipo de cédula");
        has_error = true;
    }

    const cedula = val("txtcedula");
    if (!cedula) {
        site_setError("txtcedula", "Ingrese la cédula");
        has_error = true;
    } else {
        // validar contra máscara si existe
        const mask = clientes_GetSelectedCedulaMask();
        if (mask) {
            const ok = clientes_ValidateValueAgainstMask(cedula, mask);
            if (!ok) {
                site_setError("txtcedula", "La cédula no cumple el formato requerido");
                has_error = true;
            }
        }
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

    if (has_error) site_focusFirstError();

    return has_error;
}

// ===============================
// INSERT
// ===============================
function clientes_Insert() {

    if (clientes_Valida()) return;

    document.getElementById("btnSave").disabled = true;

    let clienteData = {
        empresa_id: parseInt(empresa_id || 0),
        tipo_cedula_id: parseInt($("#slctipocedula").val() || 0),
        cedula: $("#txtcedula").val().trim(),
        nombre: $("#txtnombre").val().trim(),
        apellidos: $("#txtapellidos").val().trim(),
        correo: $("#txtcorreo").val().trim(),
        telefono: $("#txttelefono").val().trim(),
        direccion: $("#txtdireccion").val().trim()
    };

    const sCliente = JSON.stringify(clienteData);
    const token = $('input[name="__RequestVerificationToken"]').val();

    $.ajax({
        url: '/Clientes/Clientes_Insert',
        type: 'POST',
        data: {
            __RequestVerificationToken: token,
            pCliente: sCliente
        },
        success: function (response) {

            document.getElementById("btnSave").disabled = false;

            response = (response || "").replace(/\(Parameter 'Original'\)/g, '');

            if (response === "") {
                site_showAlert("Éxito", "Cliente guardado correctamente.", "success");
                setTimeout(() => {
                    window.location.href = "/Clientes/Clientes_Index";
                }, 800);
            } else {
                site_showAlert("Error", response, "error");
            }
        },
        error: function () {
            document.getElementById("btnSave").disabled = false;
            site_showAlert("Error", "Error al guardar los datos. SP: Clientes_Insert", "error");
        }
    });
}

// ===============================
// UPDATE
// ===============================
function clientes_Update() {

    if (clientes_Valida()) return;

    document.getElementById("btnSave").disabled = true;

    let clienteData = {
        empresa_id: parseInt(empresa_id || 0),
        cliente_id: cliente_id,
        tipo_cedula_id: parseInt($("#slctipocedula").val() || 0),
        cedula: $("#txtcedula").val().trim(),
        nombre: $("#txtnombre").val().trim(),
        apellidos: $("#txtapellidos").val().trim(),
        correo: $("#txtcorreo").val().trim(),
        telefono: $("#txttelefono").val().trim(),
        direccion: $("#txtdireccion").val().trim()
    };

    const sCliente = JSON.stringify(clienteData);
    const token = $('input[name="__RequestVerificationToken"]').val();

    $.ajax({
        url: '/Clientes/Clientes_Update',
        type: 'POST',
        data: {
            __RequestVerificationToken: token,
            pCliente: sCliente
        },
        success: function (response) {

            document.getElementById("btnSave").disabled = false;

            response = (response || "").replace(/\(Parameter 'Original'\)/g, '');

            if (response === "") {
                site_showAlert("Éxito", "Cliente actualizado correctamente.", "success");
                setTimeout(() => {
                    window.location.href = "/Clientes/Clientes_Index";
                }, 800);
            } else {
                site_showAlert("Error", response, "error");
            }
        },
        error: function () {
            document.getElementById("btnSave").disabled = false;
            site_showAlert("Error", "Error al actualizar los datos. SP: Clientes_Update", "error");
        }
    });
}

// ===============================
// SELECT
// ===============================
function clientes_Select() {

    const token = $('input[name="__RequestVerificationToken"]').val();

    $.ajax({
        url: '/Clientes/Clientes_Select',
        type: 'POST',
        data: {
            __RequestVerificationToken: token,
            empresa_id: empresa_id,
            cliente_id: cliente_id
        },
        success: function (d) {

            if (!site_isJson(d)) {
                d = (d || "").replace(/\(Parameter 'Original'\)/g, "");
                site_showAlert("Error", d, "error");
                return;
            }

            const data = JSON.parse(d);

            if (!data || data.length === 0) {
                site_showAlert("Información", "No se encontró el cliente.", "info");
                return;
            }

            const c = data[0];

            $("#slctipocedula").val(c.tipo_cedula_id || "");
            $("#txtcedula").val(c.cedula || "");
            $("#txtnombre").val(c.nombre || "");
            $("#txtapellidos").val(c.apellidos || "");
            $("#txtcorreo").val(c.correo || "");
            $("#txttelefono").val(c.telefono || "");
            $("#txtdireccion").val(c.direccion || "");

            // aplicar máscara visual
            clientes_ApplyCedulaMask();
        },
        error: function () {
            site_showAlert("Error", "Error al obtener datos. SP: Clientes_Select", "error");
        }
    });
}

// ===============================
// TIPOS CEDULA LOAD
// ===============================
function clientes_TiposCedulas_Load() {

    const token = $('input[name="__RequestVerificationToken"]').val();

    $.ajax({
        url: '/Clientes/Tipos_Cedulas_Load',
        type: 'POST',
        data: { __RequestVerificationToken: token, empresa_id },
        success: function (d) {

            if (site_isJson(d)) {
                const data = JSON.parse(d);

                // cache para máscaras
                tiposCedulaCache = data || [];

                // combo
                site_loadCombo('#slctipocedula', data, 'tipo_cedula_id', 'nombre');

                // si solo hay 1, seleccionarla
                if (data && data.length === 1) {
                    $("#slctipocedula").val(data[0].tipo_cedula_id);
                }

                clientes_ApplyCedulaMask();
            } else {
                d = (d || "").replace(/\(Parameter 'Original'\)/g, "");
                site_showAlert("Error", d, "error");
            }
        },
        error: function () {
            site_showAlert("Error", "Error al obtener datos. SP: Tipos_Cedulas_Load", "error");
        }
    });
}

// ===============================
// MÁSCARA / VALIDACIÓN CÉDULA
// ===============================
function clientes_GetSelectedCedulaMask() {
    const id = parseInt($("#slctipocedula").val() || 0);
    if (!id) return "";

    const item = (tiposCedulaCache || []).find(x => parseInt(x.tipo_cedula_id) === id);
    return (item && item.mascara) ? item.mascara : "";
}

function clientes_ApplyCedulaMask() {
    const mask = clientes_GetSelectedCedulaMask();

    if (mask) {
        $("#lblMascaraCedula").text("Formato: " + mask).show();
        $("#txtcedula").attr("placeholder", mask);
    } else {
        $("#lblMascaraCedula").text("").hide();
        $("#txtcedula").removeAttr("placeholder");
    }

    // al cambiar el tipo, re-formatear el valor actual
    clientes_FormatCedulaOnInput();
}

function clientes_FormatCedulaOnInput() {
    const mask = clientes_GetSelectedCedulaMask();
    if (!mask) return;

    let raw = ($("#txtcedula").val() || "").toString();

    // solo dígitos (en CR las cédulas usualmente son numéricas)
    raw = raw.replace(/\D/g, "");

    const formatted = clientes_ApplyMaskToDigits(raw, mask);
    $("#txtcedula").val(formatted);
}

// mascara tipo: "0-0000-0000" o "0-0000-000000" etc.
// reglas:
// - '0' = dígito requerido
// - cualquier otro caracter se inserta como separador
function clientes_ApplyMaskToDigits(digits, mask) {
    let result = "";
    let di = 0;

    for (let i = 0; i < mask.length; i++) {
        const m = mask[i];

        if (m === "0") {
            if (di < digits.length) {
                result += digits[di];
                di++;
            } else {
                break; // no completar más si no hay dígitos
            }
        } else {
            // solo agregar separador si ya hay al menos un dígito colocado
            // y si todavía faltan dígitos por colocar (evita terminar con "-")
            if (result.length > 0 && di < digits.length) {
                result += m;
            }
        }
    }

    return result;
}

function clientes_ValidateValueAgainstMask(value, mask) {
    // Convertir máscara a regex: 0 => \d, otros => literal escapado
    const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    let pattern = "^";
    for (let i = 0; i < mask.length; i++) {
        const m = mask[i];
        if (m === "0") pattern += "\\d";
        else pattern += esc(m);
    }
    pattern += "$";

    const re = new RegExp(pattern);
    return re.test((value || "").trim());
}
