using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Pedidos360.Models;
using System.Diagnostics;

namespace Pedidos360.Controllers
{
    public class ProductosController : Controller
    {
        private readonly IConfiguration _config;

        public ProductosController(IConfiguration config)
        {
            _config = config;
        }

        public IActionResult Productos_Index()
        {
            return View();
        }

        public IActionResult Productos()
        {
            return View();
        }

        // ===================== LOADS =====================

        [HttpPost]
        public string Productos_Load(int empresa_id)
        {
            try
            {
                TProductos productos = new TProductos();
                var json = "";

                var messageError = productos.Productos_Load(empresa_id, ref json, _config).Trim();

                if (!string.IsNullOrEmpty(messageError))
                    throw new ArgumentException(messageError);

                return json;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        // ===================== COMBOS =====================

        [HttpPost]
        public string Categorias_Load(int empresa_id)
        {
            try
            {
                TProductos productos = new TProductos();
                var json = "";

                var messageError = productos.Categorias_Load(empresa_id, ref json, _config).Trim();

                if (!string.IsNullOrEmpty(messageError))
                    throw new ArgumentException(messageError);

                return json;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        [HttpPost]
        public string Tipos_Impuestos_Load(int empresa_id)
        {
            try
            {
                TProductos productos = new TProductos();
                var json = "";

                var messageError = productos.Tipos_Impuestos_Load(empresa_id, ref json, _config).Trim();

                if (!string.IsNullOrEmpty(messageError))
                    throw new ArgumentException(messageError);

                return json;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        // ===================== CRUD =====================

        [HttpPost]
        public string Productos_Insert(string pProducto)
        {
            try
            {
                TProductos productos = new TProductos();
                return productos.Productos_Insert(pProducto, _config);
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        [HttpPost]
        public string Productos_Select(int empresa_id, int producto_id)
        {
            try
            {
                TProductos productos = new TProductos();
                var json = "";

                var messageError = productos.Productos_Select(empresa_id, producto_id, ref json, _config).Trim();

                if (!string.IsNullOrEmpty(messageError))
                    throw new ArgumentException(messageError);

                return json;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        [HttpPost]
        public string Productos_Update(string pProducto)
        {
            try
            {
                TProductos productos = new TProductos();
                return productos.Productos_Update(pProducto, _config);
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        [HttpPost]
        public string Productos_Delete(string pProducto)
        {
            try
            {
                TProductos productos = new TProductos();
                return productos.Productos_Delete(pProducto, _config);
            }
            catch (Exception ex)
            {
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
