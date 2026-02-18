using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Pedidos360.Models;
using System.Diagnostics;

namespace Pedidos360.Controllers
{
    public class UsuariosController : Controller
    {
        // Guarda la configuración de la aplicación (appsettings.json)
        private readonly IConfiguration _config;

        public UsuariosController(IConfiguration config)
        {
            // Guardamos esa configuración para usarla después
            _config = config;
        }


        public IActionResult Usuarios_Index()
        {
            return View();
        }
        public IActionResult Usuarios()
        {
            return View();
        }

        [HttpPost]
        public string Usuarios_Load(int empresa_id)
        {
            try
            {
                TUsuarios usuarios = new TUsuarios();

                var json = "";

                var messageError = usuarios.Usuarios_Load(empresa_id, ref json, _config);

                // Verificar si ocurrió algún error
                messageError = messageError.Trim();

                if (!String.IsNullOrEmpty(messageError))
                {
                    throw new System.ArgumentException(messageError);
                }
                return json;
            }
            catch (Exception ex)
            {
                return ex.Message; // Devolver mensaje de error si falla
            }
        }

        public string Roles_Load(int empresa_id)
        {
            try
            {
                TUsuarios usuarios = new TUsuarios();

                var json = "";

                var messageError = usuarios.Roles_Load(empresa_id, ref json, _config);

                // Verificar si ocurrió algún error
                messageError = messageError.Trim();

                if (!String.IsNullOrEmpty(messageError))
                {
                    throw new System.ArgumentException(messageError);
                }
                return json;
            }
            catch (Exception ex)
            {
                return ex.Message; // Devolver mensaje de error si falla
            }
        }
        [HttpPost]
        public string Usuarios_Insert(string pUsuario)
        {

            try
            {
                TUsuarios usuarios = new TUsuarios();

                string smensaje = usuarios.Usuarios_Insert(pUsuario, _config);
                return smensaje;
            }
            catch (Exception ex)
            {
                // Devolver mensaje de error si falla
                return ex.Message;
            }
        }

        [HttpPost]
        public string Usuarios_Select(int empresa_id, int usuario_id)
        {
            try
            {
                TUsuarios usuarios = new TUsuarios();

                var json = "";

                var messageError = usuarios.Usuarios_Select(empresa_id, usuario_id, ref json, _config);

                // Verificar si ocurrió algún error
                messageError = messageError.Trim();

                if (!String.IsNullOrEmpty(messageError))
                {
                    throw new System.ArgumentException(messageError);
                }
                return json;
            }
            catch (Exception ex)
            {
                return ex.Message; // Devolver mensaje de error si falla
            }
        }

        [HttpPost]
        public string Usuarios_Update(string pUsuario)
        {

            try
            {
                TUsuarios usuarios = new TUsuarios();

                string smensaje = usuarios.Usuarios_Update(pUsuario, _config);
                return smensaje;
            }
            catch (Exception ex)
            {
                // Devolver mensaje de error si falla
                return ex.Message;
            }
        }


        [HttpPost]
        public string Usuarios_Delete(string pUsuario)
        {

            try
            {
                TUsuarios usuarios = new TUsuarios();

                string smensaje = usuarios.Usuarios_Delete(pUsuario, _config);
                return smensaje;
            }
            catch (Exception ex)
            {
                // Devolver mensaje de error si falla
                return ex.Message;
            }
        }
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
