using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Pedidos360.Models;
using System.Diagnostics;

namespace Pedidos360.Controllers
{
    public class SecurityController : Controller
    {
        // Guarda la configuración de la aplicación (appsettings.json)
        private readonly IConfiguration _config;

        public SecurityController(IConfiguration config)
        {
            // Guardamos esa configuración para usarla después
            _config = config;
        }

        public IActionResult Login()
        {
            return View();
        }
        public IActionResult Select_Company()
        {
            return View();
        }

        [HttpPost]
        public string Usuarios_Valida_Inicio_Sesion(TUsuarios pUsuario)
        {
            try
            {
                var json = "";

                // Llamar al método que obtiene los datos de roles
                var messageError = pUsuario.Usuarios_Valida_Inicio_Sesion(ref json, _config);

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
    }
}
