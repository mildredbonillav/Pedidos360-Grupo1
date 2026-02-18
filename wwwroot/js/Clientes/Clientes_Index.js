let empresa_id = sessionStorage.getItem("empresa_id");
var $table = $('#tblClientes');

$(function () {
    clientes_index_Clientes_Load();
});

//Carga la lista de clientes
function clientes_index_Clientes_Load() {
    var token = $('[name=__RequestVerificationToken]').val();

    const MIN_LOADING_TIME = 500;
    const startTime = Date.now();

    Swal.fire({
        title: 'Cargando clientes...',
        text: 'Por favor espere mientras se obtienen los datos.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });

    $.ajax({
        url: '/Clientes/Clientes_Load',
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
                        clientes_index_Clientes_Load_Table(data);
                    } else {
                        $("#emptyState").removeClass("d-none");
                        clientes_index_Clientes_Load_Table([]); // por si querés que igual se inicialice
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
                site_showAlert("Error", "Error al obtener datos. SP: Clientes_Load", "error");
            };

            if (remainingTime > 0) setTimeout(closeAlertOnError, remainingTime);
            else closeAlertOnError();
        }
    });
}

function clientes_index_Clientes_Load_Table(data) {

    const colTipoCedula = {
        field: 'tipo_cedula_nombre',   // ajustá si tu SP usa otro nombre
        title: 'Tipo',
        align: 'left',
        sortable: true,
        visible: true,
        width: '140',
        filterControl: 'input'
    };

    const colCedula = {
        field: 'cedula',
        title: 'Cédula',
        align: 'left',
        sortable: true,
        visible: true,
        width: '160',
        filterControl: 'input'
    };

    const colNombre = {
        field: 'nombre_completo', // si no lo tenés, podés armarlo en el SP o aquí
        title: 'Nombre',
        align: 'left',
        sortable: true,
        visible: true,
        filterControl: 'input'
    };

    const colCorreo = {
        field: 'correo',
        title: 'Correo',
        align: 'left',
        sortable: true,
        visible: true,
        filterControl: 'input'
    };

    const colTelefono = {
        field: 'telefono',
        title: 'Teléfono',
        align: 'left',
        sortable: true,
        visible: true,
        width: '140',
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
                        onclick="clientes_index_Clientes_Update_Redirect(${row.cliente_id})"
                        title="Editar cliente">
                    <i class="fas fa-edit"></i>
                </button>`;

            const btnEliminar = `
                <button class="btn btn-sm btn-outline-danger mx-1"
                        onclick="clientes_index_Clientes_Delete('${row.cliente_id}', '${row.nombre_completo || ''}')"
                        title="Eliminar cliente">
                    <i class="fas fa-trash"></i>
                </button>`;

            return btnEditar + btnEliminar;
        }
    };

    $table.bootstrapTable('destroy').bootstrapTable({
        locale: 'es-CR',
        data: data ?? [],
        columns: [
            colTipoCedula,
            colCedula,
            colNombre,
            colCorreo,
            colTelefono,
            colAcciones
        ],
        search: false,
        filterControl: true,
        pagination: true,
        pageSize: 10
    });

    if (!data || data.length === 0) $("#emptyState").removeClass("d-none");
    else $("#emptyState").addClass("d-none");

    try { $table.bootstrapTable('hideLoading'); } catch { }
    $('.fixed-table-loading').hide();
}

//Direcciona a crear un cliente
function clientes_index_Clientes_Insert_Redirect() {
    window.location.href = "/Clientes/Clientes";
}

//Direcciona a editar un cliente
function clientes_index_Clientes_Update_Redirect(param) {
    window.location.href = "/Clientes/Clientes?cliente_id=" + encodeURIComponent(param);
}

function clientes_index_Clientes_Delete(cliente_id, cliente_nombre) {
    clientes_index_Clientes_Delete_Confirmation(cliente_nombre, () => {

        let clienteData = { cliente_id: cliente_id, empresa_id: empresa_id };
        const sCliente = JSON.stringify(clienteData);
        const token = $('[name="__RequestVerificationToken"]').val();

        $.ajax({
            url: '/Clientes/Clientes_Delete',
            type: 'POST',
            data: {
                __RequestVerificationToken: token,
                pCliente: sCliente
            },
            success: function (response) {
                response = (response || "").replace(/\(Parameter 'Original'\)/g, '');

                if (response === "") {
                    site_showAlert("Éxito", "Cliente eliminado correctamente.", "success");
                    setTimeout(() => {
                        window.location.href = "/Clientes/Clientes_Index";
                    }, 800);
                } else {
                    site_showAlert("Error", response, "error");
                }
            },
            error: function () {
                site_showAlert("Error", "Error al eliminar el cliente. Acción: Clientes_Delete", "error");
            }
        });
    });
}

function clientes_index_Clientes_Delete_Confirmation(cliente_nombre, callback) {
    Swal.fire({
        title: `¿Eliminar al cliente ${cliente_nombre}?`,
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
