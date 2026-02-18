document.addEventListener("DOMContentLoaded", function () {

    var empresasJson = sessionStorage.getItem("empresas_disponibles");
    console.log(empresasJson)

    if (!empresasJson) {
        window.location.href = "/Security/Login";
        return;
    }

    var empresas = JSON.parse(empresasJson);
    var contenedor = document.getElementById("lstEmpresas");

    contenedor.innerHTML = "";

    empresas.forEach((e, index) => {

        var btn = document.createElement("button");
        btn.className = "list-group-item list-group-item-action";

        btn.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <strong>${e.empresa_nombre}</strong><br />
                    <small class="text-muted">Rol: ${e.rol_nombre}</small>
                </div>
                <i class="bi bi-chevron-right"></i>
            </div>
        `;
        btn.classList.add("shadow-sm");
        btn.style.cursor = "pointer";

        btn.onclick = function () {
            seleccionarEmpresa(e);
        };

        contenedor.appendChild(btn);
    });
});


function seleccionarEmpresa(e) {
    sessionStorage.setItem("empresa_id", e.empresa_id);
    sessionStorage.setItem("empresa_nombre", e.empresa_nombre);

    sessionStorage.setItem("rol_id", e.rol_id);
    sessionStorage.setItem("rol_nombre", e.rol_nombre);

    window.location.href = "/Home/Index";
}


function cerrarSesion() {
    sessionStorage.clear();
    window.location.href = "/Security/Login";
}
