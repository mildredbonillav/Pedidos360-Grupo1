using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Pedidos360.Models;
using System.Diagnostics;

namespace Pedidos360.Controllers
{
    public class ClientesController : Controller
    {
        private readonly IConfiguration _config;

        public ClientesController(IConfiguration config)
        {
            _config = config;
        }

        public IActionResult Clientes_Index()
        {
            return View();
        }

        public IActionResult Clientes()
        {
            return View();
        }

        // LISTAR CLIENTES (por empresa)
        [HttpPost]
        public string Clientes_Load(int empresa_id)
        {
            try
            {
                TClientes clientes = new TClientes();

                var json = "";
                var messageError = clientes.Clientes_Load(empresa_id, ref json, _config);

                messageError = messageError.Trim();
                if (!string.IsNullOrEmpty(messageError))
                    throw new ArgumentException(messageError);

                return json;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        // CARGAR TIPOS DE CÉDULA (combo)
        [HttpPost]
        public string Tipos_Cedulas_Load(int empresa_id)
        {
            try
            {
                TClientes clientes = new TClientes();

                var json = "";
                var messageError = clientes.Tipos_Cedulas_Load(empresa_id, ref json, _config);

                messageError = messageError.Trim();
                if (!string.IsNullOrEmpty(messageError))
                    throw new ArgumentException(messageError);

                return json;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        // SELECT (un cliente)
        [HttpPost]
        public string Clientes_Select(int empresa_id, int cliente_id)
        {
            try
            {
                TClientes clientes = new TClientes();

                var json = "";
                var messageError = clientes.Clientes_Select(empresa_id, cliente_id, ref json, _config);

                messageError = messageError.Trim();
                if (!string.IsNullOrEmpty(messageError))
                    throw new ArgumentException(messageError);

                return json;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        // INSERT
        [HttpPost]
        public string Clientes_Insert(string pCliente)
        {
            try
            {
                TClientes clientes = new TClientes();
                string smensaje = clientes.Clientes_Insert(pCliente, _config);
                return smensaje;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        // UPDATE
        [HttpPost]
        public string Clientes_Update(string pCliente)
        {
            try
            {
                TClientes clientes = new TClientes();
                string smensaje = clientes.Clientes_Update(pCliente, _config);
                return smensaje;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        // DELETE
        [HttpPost]
        public string Clientes_Delete(string pCliente)
        {
            try
            {
                TClientes clientes = new TClientes();
                string smensaje = clientes.Clientes_Delete(pCliente, _config);
                return smensaje;
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
