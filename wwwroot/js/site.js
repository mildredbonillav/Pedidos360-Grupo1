$(function () {

    site_loadNavbarUserInfo();

});

function site_loadNavbarUserInfo() {

    var companyName = sessionStorage.getItem("empresa_nombre");
    var userName = sessionStorage.getItem("usuario_nombre");
    var userRole = sessionStorage.getItem("rol_nombre");

    $("#lblEmpresa").text(companyName || "");
    $("#lblUserName").text(userName || "");
    $("#lblUserRole").text(userRole || "");

    // Show change company only if multiple companies
    var companies = sessionStorage.getItem("empresas_disponibles");
    if (!companies) {
        $("#liChangeCompany").hide();
    }
}

function site_changeCompany() {
    window.location.href = "/Security/Select_Company";
}

function site_logout() {
    sessionStorage.clear();
    window.location.href = "/Security/Login";
}

function site_showAlert(title, text, icon = "info") {
    Swal.fire({
        title: title,
        text: text,
        icon: icon,
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#0f7c8a"
    });
}

function site_isJson(variable) {
    try {
        JSON.parse(variable);
        return true;
    } catch (error) {
        return false;
    }
    return false;
}

function site_loadCombo(selector, data, valueField, textField, placeholder = null) {

    var $select = $(selector);

    if ($select.length === 0) {
        console.warn("site_loadCombo: selector no encontrado -> " + selector);
        return;
    }

    // Limpiar select
    $select.empty();

    // Placeholder opcional
    if (placeholder) {
        $select.append(
            $('<option>', {
                value: '',
                text: placeholder
            })
        );
    }

    // Validar data
    if (!Array.isArray(data)) {
        console.warn("site_loadCombo: data no es array");
        return;
    }

    // Llenar opciones
    data.forEach(item => {
        $select.append(
            $('<option>', {
                value: item[valueField],
                text: item[textField]
            })
        );
    });
}

// ==============================
// UI VALIDATION HELPERS
// ==============================

function site_clearValidation() {
    $(".is-invalid").removeClass("is-invalid");
    $(".invalid-feedback").text("");
}

function site_setError(inputId, message) {
    $("#" + inputId).addClass("is-invalid");
    $("#err_" + inputId).text(message);
}

function site_focusFirstError() {
    const first = $(".is-invalid").first();
    if (first.length) {
        first.focus();
        $('html, body').animate({
            scrollTop: first.offset().top - 120
        }, 300);
    }
}
