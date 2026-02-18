using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Pedidos360.Models;

namespace Pedidos360.Controllers
{
    public class HomeController : Controller
    {
        // Guarda la configuración de la aplicación (appsettings.json)
        private readonly IConfiguration _config;

        public HomeController(IConfiguration config)
        {
            // Guardamos esa configuración para usarla después
            _config = config;
        }


        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
