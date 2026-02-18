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