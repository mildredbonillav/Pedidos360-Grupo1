let empresa_id = sessionStorage.getItem("empresa_id");
const urlParams = new URLSearchParams(window.location.search);
const producto_id = parseInt(urlParams.get('producto_id')) || 0;

// Guarda base64 de la imagen seleccionada
let imagen_base64 = "";

$(function () {
    productos_Categorias_Load();
    productos_TiposImpuestos_Load();

    // Preview + base64 al seleccionar archivo
    $("#fileimagen").on("change", function () {
        productos_OnImagenChange(this);
    });

    if (producto_id > 0) {
        productos_UpdateMode();
        productos_Select();
    }

    // quitar error cuando el usuario corrige
    $(document).on("input change", "input, select, textarea", function () {
        $(this).removeClass("is-invalid");
        $("#err_" + this.id).text("");
    });


    $(document).on("change", "input[type='file']", function () {
        $(this).removeClass("is-invalid");
        $("#err_" + this.id).text("");
    });
});

function productos_UpdateMode() {
    $("#lblTitle").text("Editar producto");
    $("#lblSubtitle").text("Actualice la información del producto");

    // Mostrar mensajito de "mantener imagen"
    $("#lblKeepImage").removeClass("d-none");
}

// =========================
// IMAGEN
// =========================
function productos_OnImagenChange(input) {
    const file = input.files && input.files[0];

    imagen_base64 = "";

    if (!file) {
        productos_ClearPreview();
        return;
    }

    if (!file.type || !file.type.startsWith("image/")) {
        productos_ClearPreview();
        site_setError("fileimagen", "Seleccione un archivo de imagen válido.");
        input.value = "";
        return;
    }

    const maxSizeBytes = 1048576; // 1MB
    if (file.size > maxSizeBytes) {
        productos_ClearPreview();
        site_setError("fileimagen", "La imagen excede el límite de 1 MB.");
        input.value = "";
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const dataUrl = (e.target.result || "").toString(); // data:image/...;base64,xxxx
        productos_SetPreview(dataUrl);

        // Guardar base64 "puro" 
        const parts = dataUrl.split(",");
        imagen_base64 = (parts.length > 1) ? parts[1] : "";
    };
    reader.readAsDataURL(file);
}

function productos_SetPreview(dataUrl) {
    $("#imgPreview").attr("src", dataUrl).removeClass("d-none");
    $("#imgEmpty").addClass("d-none");
}

function productos_ClearPreview() {
    $("#imgPreview").attr("src", "").addClass("d-none");
    $("#imgEmpty").removeClass("d-none");
}

// =========================
// SAVE (Create/Update)
// =========================
function productos_Save() {
    if (productos_Valida()) return;

    if (producto_id > 0) {
        productos_Productos_Update();
    } else {
        productos_Productos_Insert();
    }
}

// =========================
// CREATE
// =========================
function productos_Productos_Insert() {
    if (productos_Valida()) return;

    document.getElementById("btnSave").disabled = true;

    let productoData = {
        empresa_id: parseInt(empresa_id || 0),
        categoria_id: parseInt($("#slccategoria").val() || 0),
        tipo_impuesto_id: parseInt($("#slctipo_impuesto").val() || 0),
        nombre: $("#txtnombre").val().trim(),
        precio: parseFloat($("#txtprecio").val() || 0),
        stock: parseInt($("#txtstock").val() || 0),
        imagen_base64: imagen_base64
    };

    const sProducto = JSON.stringify(productoData);
    const token = $('input[name="__RequestVerificationToken"]').val();

    $.ajax({
        url: '/Productos/Productos_Insert',
        type: 'POST',
        data: {
            __RequestVerificationToken: token,
            pProducto: sProducto
        },
        success: function (response) {
            document.getElementById("btnSave").disabled = false;

            response = (response || "").replace(/\(Parameter 'Original'\)/g, '');

            if (response === "") {
                site_showAlert("Éxito", "Producto guardado correctamente.", "success");
                setTimeout(() => {
                    window.location.href = "/Productos/Productos_Index";
                }, 800);
            } else {
                site_showAlert("Error", response, "error");
            }
        },
        error: function () {
            document.getElementById("btnSave").disabled = false;
            site_showAlert("Error", "Error al guardar los datos. SP: Productos_Insert", "error");
        }
    });
}

// =========================
// COMBOS
// =========================
function productos_Categorias_Load() {
    const token = $('input[name="__RequestVerificationToken"]').val();

    $.ajax({
        url: '/Productos/Categorias_Load',
        type: 'POST',
        data: { __RequestVerificationToken: token, empresa_id },
        success: function (d) {
            if (site_isJson(d)) {
                var data = JSON.parse(d);
                site_loadCombo('#slccategoria', data, 'categoria_id', 'nombre');
            } else {
                d = (d || "").replace(/\(Parameter 'Original'\)/g, "");
                site_showAlert("Error", d, "error");
            }
        },
        error: function () {
            site_showAlert("Error", "Error al obtener datos. SP: Categorias_Load", "error");
        }
    });
}

function productos_TiposImpuestos_Load() {
    const token = $('input[name="__RequestVerificationToken"]').val();

    $.ajax({
        url: '/Productos/Tipos_Impuestos_Load',
        type: 'POST',
        data: { __RequestVerificationToken: token, empresa_id },
        success: function (d) {
            if (site_isJson(d)) {
                var data = JSON.parse(d);
                site_loadCombo('#slctipo_impuesto', data, 'tipo_impuesto_id', 'nombre');
            } else {
                d = (d || "").replace(/\(Parameter 'Original'\)/g, "");
                site_showAlert("Error", d, "error");
            }
        },
        error: function () {
            site_showAlert("Error", "Error al obtener datos. SP: Tipos_Impuestos_Load", "error");
        }
    });
}

// =========================
// VALIDACIÓN (frontend)
// =========================
function productos_Valida() {
    site_clearValidation();

    const val = (id) => $.trim($("#" + id).val());
    let has_error = false;

    if (!val("txtnombre")) {
        site_setError("txtnombre", "Ingrese el nombre");
        has_error = true;
    }

    if (!val("txtprecio")) {
        site_setError("txtprecio", "Ingrese el precio");
        has_error = true;
    }

    if (!val("txtstock")) {
        site_setError("txtstock", "Ingrese el stock");
        has_error = true;
    }

    if (!val("slccategoria")) {
        site_setError("slccategoria", "Seleccione una categoría");
        has_error = true;
    }

    if (!val("slctipo_impuesto")) {
        site_setError("slctipo_impuesto", "Seleccione un tipo de impuesto");
        has_error = true;
    }

    // Imagen: obligatoria SOLO en create (porque en edit se mantiene la actual)
    if (producto_id === 0) {
        const hasFile = ($("#fileimagen")[0]?.files?.length || 0) > 0;
        if (!hasFile || !imagen_base64) {
            site_setError("fileimagen", "Seleccione una imagen");
            has_error = true;
        }
    }

    if (has_error) site_focusFirstError();
    return has_error;
}

// =========================
// SELECT (Editar)
// =========================
function productos_Select() {
    const token = $('input[name="__RequestVerificationToken"]').val();

    $.ajax({
        url: '/Productos/Productos_Select',
        type: 'POST',
        data: {
            __RequestVerificationToken: token,
            empresa_id: empresa_id,
            producto_id: producto_id
        },
        success: function (d) {
            if (!site_isJson(d)) {
                d = (d || "").replace(/\(Parameter 'Original'\)/g, "");
                site_showAlert("Error", d, "error");
                return;
            }

            const data = JSON.parse(d);

            if (!data || data.length === 0) {
                site_showAlert("Información", "No se encontró el producto.", "info");
                return;
            }

            const p = data[0];

            $("#txtnombre").val(p.nombre || "");
            $("#txtprecio").val(p.precio ?? "");
            $("#txtstock").val(p.stock ?? "");

            if (p.categoria_id !== undefined && p.categoria_id !== null) {
                $("#slccategoria").val(p.categoria_id);
            }

            if (p.tipo_impuesto_id !== undefined && p.tipo_impuesto_id !== null) {
                $("#slctipo_impuesto").val(p.tipo_impuesto_id);
            }

            if (p.imagen_base64) {
                const mime = "image/png";
                productos_SetPreview(`data:${mime};base64,${p.imagen_base64}`);
            }
        },
        error: function () {
            site_showAlert("Error", "Error al obtener datos. SP: Productos_Select", "error");
        }
    });
}

// =========================
// UPDATE
// =========================
function productos_Productos_Update() {
    if (productos_Valida()) return;

    document.getElementById("btnSave").disabled = true;

    const enviarImagen = (imagen_base64 && imagen_base64.trim() !== "");

    let productoData = {
        empresa_id: parseInt(empresa_id || 0),
        producto_id: producto_id,
        categoria_id: parseInt($("#slccategoria").val() || 0),
        tipo_impuesto_id: parseInt($("#slctipo_impuesto").val() || 0),
        nombre: $("#txtnombre").val().trim(),
        precio: parseFloat($("#txtprecio").val() || 0),
        stock: parseInt($("#txtstock").val() || 0),
        imagen_base64: enviarImagen ? imagen_base64 : null
    };

    const sProducto = JSON.stringify(productoData);
    const token = $('input[name="__RequestVerificationToken"]').val();

    $.ajax({
        url: '/Productos/Productos_Update',
        type: 'POST',
        data: {
            __RequestVerificationToken: token,
            pProducto: sProducto
        },
        success: function (response) {
            document.getElementById("btnSave").disabled = false;

            response = (response || "").replace(/\(Parameter 'Original'\)/g, '');

            if (response === "") {
                site_showAlert("Éxito", "Producto actualizado correctamente.", "success");
                setTimeout(() => {
                    window.location.href = "/Productos/Productos_Index";
                }, 800);
            } else {
                site_showAlert("Error", response, "error");
            }
        },
        error: function () {
            document.getElementById("btnSave").disabled = false;
            site_showAlert("Error", "Error al actualizar los datos. SP: Productos_Update", "error");
        }
    });
}
