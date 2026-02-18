using Newtonsoft.Json;
using System.Data;
using System.Security.Cryptography;
using System.Text;

namespace Pedidos360.Models
{
    public class TEmpresas
    {
        public int empresa_id { get; set; }
        public int rol_id { get; set; }
        public string nombre { get; set; }
        public string descripcion { get; set; }
        public bool activo { get; set; }

    }
}
