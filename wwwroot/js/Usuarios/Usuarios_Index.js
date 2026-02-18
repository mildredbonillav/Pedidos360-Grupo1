let empresa_id = sessionStorage.getItem("empresa_id");
var $table = $('#tblUsuarios');

$(function () {
    usuarios_index_Usuarios_Load();
});

//Carga la lista de usuarios
function usuarios_index_Usuarios_Load() {
    var token = $('[name=__RequestVerificationToken]').val();

    const MIN_LOADING_TIME = 500;
    const startTime = Date.now();

    Swal.fire({
        title: 'Cargando usuarios...',
        text: 'Por favor espere mientras se obtienen los datos.',
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        }
    });


    $.ajax({
        url: '/Usuarios/Usuarios_Load',
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
                        usuarios_index_Usuarios_Load_Table(data);
                    } else {
                        $("#emptyState").removeClass("d-none");
                    }
                } else {
                    d = d.replace(/\(Parameter 'Original'\)/g, "");
                    site_showAlert("Error", d, "error");
                }
            };

            if (remainingTime > 0) {
                setTimeout(closeAlert, remainingTime);
            } else {
                closeAlert();
            }
        },
        error: function () {
            const elapsed = Date.now() - startTime;
            const remainingTime = MIN_LOADING_TIME - elapsed;

            const closeAlertOnError = () => {
                Swal.close();
                site_showAlert("Error", "Error al obtener datos. SP: Usuarios_Load", "error");
            };

            if (remainingTime > 0) {
                setTimeout(closeAlertOnError, remainingTime);
            } else {
                closeAlertOnError();
            }
        }
    });
}

function usuarios_index_Usuarios_Load_Table(data) {

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
        field: 'nombre_completo',
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

    const colRol = {
        field: 'rol_nombre',
        title: 'Rol',
        align: 'left',
        sortable: true,
        visible: true,
        filterControl: 'input'
    };

    const colAcciones = {
        field: 'Acciones',
        title: 'Acciones',
        align: 'center',
        sortable: false,
        width: '200',
        formatter: function (value, row) {

            // Editar
            const btnEditar = `
                <button class="btn btn-sm btn-outline-primary mx-1"
                        onclick="usuarios_index_Usuarios_Update_Redirect(${row.usuario_id})"
                        title="Editar usuario">
                    <i class="fas fa-edit"></i>
                </button>`;

            //Eliminar usuario completo
            const btnEliminar = `
                <button class="btn btn-sm btn-outline-danger mx-1"
                        onclick="usuarios_index_Usuarios_Delete('${row.usuario_id}', '${row.nombre_completo}')"
                        title="Eliminar usuario">
                    <i class="fas fa-trash"></i>
                </button>`;

            //Quitar acceso a la compañía
            const btnQuitarAcceso = `
                <button class="btn btn-sm btn-outline-warning mx-1"
                        onclick="usuarios_index_Usuarios_RemoveAccess('${row.usuario_id}', '${row.nombre_completo}')"
                        title="Quitar acceso a esta empresa">
                    <i class="fa-solid fa-user-slash"></i>
                </button>`;

            return btnEditar + btnEliminar + btnQuitarAcceso;
        }
    };

    $table.bootstrapTable('destroy').bootstrapTable({
        locale: 'es-CR',
        data: data ?? [],
        columns: [
            colCedula,
            colNombre,
            colCorreo,
            colRol,
            colAcciones
        ],
        search: false,
        filterControl: true,
        pagination: true,
        pageSize: 10
    });

    // Empty state
    if (!data || data.length === 0) {
        $("#emptyState").removeClass("d-none");
    } else {
        $("#emptyState").addClass("d-none");
    }

    try { $table.bootstrapTable('hideLoading'); } catch { }
    $('.fixed-table-loading').hide();
}

//Direcciona a crear un usuario
function usuarios_index_Usuarios_Insert_Redirect() {
    window.location.href = "/Usuarios/Usuarios";  // Cambia la URL por la que desees
}
//Direcciona a editar un usuario
function usuarios_index_Usuarios_Update_Redirect(param) {
    // Cambia la URL de acuerdo al parámetro recibido
    window.location.href = "/Usuarios/Usuarios?usuario_id=" + encodeURIComponent(param);
}


function usuarios_index_Usuarios_Delete(usuario_id, usuario_nombre) {
    usuarios_index_Usuarios_Delete_Confirmation(usuario_nombre, () => {

        let usuarioData = {
            usuario_id: usuario_id
        };

        const sUsuario = JSON.stringify(usuarioData);
        const token = $('[name="__RequestVerificationToken"]').val();

        $.ajax({
            url: '/Usuarios/Usuarios_Delete',
            type: 'POST',
            data: {
                __RequestVerificationToken: token,
                pUsuario: sUsuario
            },
            success: function (response) {
                response = (response || "").replace(/\(Parameter 'Original'\)/g, '');

                if (response === "") {
                    site_showAlert("Éxito", "Usuario eliminado correctamente para todas las empresas.", "success");
                    setTimeout(() => {
                        window.location.href = "/Usuarios/Usuarios_Index";
                    }, 800);
                } else {
                    site_showAlert("Error", response, "error");
                }
            },
            error: function () {
                site_showAlert("Error", "Error al eliminar el usuario. Acción: Usuarios_Delete", "error");
            }
        });
    });
}

function usuarios_index_Usuarios_Delete_Confirmation(usuario_nombre, callback) {
    Swal.fire({
        title: `¿Eliminar al usuario ${usuario_nombre}?`,
        html: `
            <div style="text-align:left">
                <p style="margin:0 0 6px 0;">Esta acción <b>no se puede deshacer</b>.</p>
                <p style="margin:0;"><b>Importante:</b> si lo eliminas, se eliminará <b>para todas las empresas</b>.</p>
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
