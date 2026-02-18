let empresa_id = sessionStorage.getItem("empresa_id");
var $table = $('#tblProductos');

$(function () {
    productos_index_Productos_Load();
});

// Carga la lista de productos
function productos_index_Productos_Load() {
    var token = $('[name=__RequestVerificationToken]').val();

    const MIN_LOADING_TIME = 500;
    const startTime = Date.now();

    Swal.fire({
        title: 'Cargando productos...',
        text: 'Por favor espere mientras se obtienen los datos.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    $.ajax({
        url: '/Productos/Productos_Load',
        type: 'POST',
        data: { __RequestVerificationToken: token, empresa_id },
        success: function (d) {
            const elapsed = Date.now() - startTime;
            const remainingTime = MIN_LOADING_TIME - elapsed;

            const closeAlert = () => {
                Swal.close();

                if (site_isJson(d)) {
                    var data = JSON.parse(d);
                    if (data.length > 0) {
                        productos_index_Productos_Load_Table(data);
                    } else {
                        $("#emptyState").removeClass("d-none");
                    }
                } else {
                    d = (d || "").replace(/\(Parameter 'Original'\)/g, "");
                    site_showAlert("Error", d, "error");
                }
            };

            if (remainingTime > 0) setTimeout(closeAlert, remainingTime);
            else closeAlert();
        },
        error: function () {
            const elapsed = Date.now() - startTime;
            const remainingTime = MIN_LOADING_TIME - elapsed;

            const closeAlertOnError = () => {
                Swal.close();
                site_showAlert("Error", "Error al obtener datos. SP: Productos_Load", "error");
            };

            if (remainingTime > 0) setTimeout(closeAlertOnError, remainingTime);
            else closeAlertOnError();
        }
    });
}

function productos_index_Productos_Load_Table(data) {

    const colId = {
        field: 'producto_id',
        title: 'ID',
        align: 'left',
        sortable: true,
        visible: true,
        width: '90',
        filterControl: 'input'
    };

    const colNombre = {
        field: 'nombre',
        title: 'Producto',
        align: 'left',
        sortable: true,
        visible: true,
        filterControl: 'input'
    };

    // Recomendación: que el SP devuelva categoria_nombre
    const colCategoria = {
        field: 'categoria_nombre',
        title: 'Categoría',
        align: 'left',
        sortable: true,
        visible: true,
        filterControl: 'input'
    };

    // Recomendación: que el SP devuelva tipo_impuesto_nombre
    const colImpuesto = {
        field: 'tipo_impuesto_nombre',
        title: 'Impuesto',
        align: 'left',
        sortable: true,
        visible: true,
        filterControl: 'input'
    };

    const colPrecio = {
        field: 'precio',
        title: 'Precio',
        align: 'right',
        sortable: true,
        width: '120',
        formatter: function (value) {
            if (value === null || value === undefined || value === "") return "";
            let n = Number(value);
            if (isNaN(n)) return value;
            return n.toLocaleString('es-CR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        },
        filterControl: 'input'
    };

    const colStock = {
        field: 'stock',
        title: 'Stock',
        align: 'right',
        sortable: true,
        width: '110',
        filterControl: 'input'
    };

    const colAcciones = {
        field: 'Acciones',
        title: 'Acciones',
        align: 'center',
        sortable: false,
        width: '160',
        formatter: function (value, row) {

            const btnEditar = `
                <button class="btn btn-sm btn-outline-primary mx-1"
                        onclick="productos_index_Productos_Update_Redirect(${row.producto_id})"
                        title="Editar producto">
                    <i class="fas fa-edit"></i>
                </button>`;

            const btnEliminar = `
                <button class="btn btn-sm btn-outline-danger mx-1"
                        onclick="productos_index_Productos_Delete(${row.producto_id}, '${(row.nombre || "").replace(/'/g, "\\'")}')"
                        title="Eliminar producto">
                    <i class="fas fa-trash"></i>
                </button>`;

            return btnEditar + btnEliminar;
        }
    };

    $table.bootstrapTable('destroy').bootstrapTable({
        locale: 'es-CR',
        data: data ?? [],
        columns: [
            colId,
            colNombre,
            colCategoria,
            colImpuesto,
            colPrecio,
            colStock,
            colAcciones
        ],
        search: false,
        filterControl: true,
        pagination: true,
        pageSize: 10
    });

    // Empty state
    if (!data || data.length === 0) $("#emptyState").removeClass("d-none");
    else $("#emptyState").addClass("d-none");

    try { $table.bootstrapTable('hideLoading'); } catch { }
    $('.fixed-table-loading').hide();
}

// Direcciona a crear un producto
function productos_index_Productos_Insert_Redirect() {
    window.location.href = "/Productos/Productos";
}

// Direcciona a editar un producto
function productos_index_Productos_Update_Redirect(producto_id) {
    window.location.href = "/Productos/Productos?producto_id=" + encodeURIComponent(producto_id);
}

function productos_index_Productos_Delete(producto_id, producto_nombre) {
    productos_index_Productos_Delete_Confirmation(producto_nombre, () => {

        let productoData = {
            empresa_id: Number(empresa_id),
            producto_id: Number(producto_id)
        };

        const sProducto = JSON.stringify(productoData);
        const token = $('[name="__RequestVerificationToken"]').val();

        $.ajax({
            url: '/Productos/Productos_Delete',
            type: 'POST',
            data: {
                __RequestVerificationToken: token,
                pProducto: sProducto
            },
            success: function (response) {
                response = (response || "").replace(/\(Parameter 'Original'\)/g, '');

                if (response === "") {
                    site_showAlert("Éxito", "Producto eliminado correctamente.", "success");
                    setTimeout(() => {
                        window.location.href = "/Productos/Productos_Index";
                    }, 800);
                } else {
                    site_showAlert("Error", response, "error");
                }
            },
            error: function () {
                site_showAlert("Error", "Error al eliminar el producto. Acción: Productos_Delete", "error");
            }
        });
    });
}

function productos_index_Productos_Delete_Confirmation(producto_nombre, callback) {
    Swal.fire({
        title: `¿Eliminar el producto ${producto_nombre}?`,
        html: `
            <div style="text-align:left">
                <p style="margin:0 0 6px 0;">Esta acción <b>no se puede deshacer</b>.</p>
            </div>
        `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        allowOutsideClick: false,
        allowEscapeKey: false,
        buttonsStyling: false,
        customClass: {
            confirmButton: "btn btn-primary mr-3",
            cancelButton: "btn btn-secondary ml-3"
        }
    }).then((result) => {
        if (result.isConfirmed) {
            if (callback) callback();
        }
    });
}
