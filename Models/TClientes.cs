using Newtonsoft.Json;
using System.Data;

namespace Pedidos360.Models
{
    public class TClientes
    {
        public int empresa_id { get; set; }
        public int cliente_id { get; set; }
        public int tipo_cedula_id { get; set; }

        public string cedula { get; set; }
        public string nombre { get; set; }
        public string apellidos { get; set; }
        public string correo { get; set; }
        public string telefono { get; set; }
        public string direccion { get; set; }
        public bool activo { get; set; }

        // ? Cargar tipos de cédula
        public string Tipos_Cedulas_Load(int empresa_id, ref string jsonRespuesta, IConfiguration configuration)
        {
            string constring = configuration.GetConnectionString("Conexion");
            string _MessageError = "";
            TDataAccess DA = new TDataAccess(constring);
            DataSet datos = new DataSet();

            try
            {
                string query = "exec Tipos_Cedulas_Load " + empresa_id;
                _MessageError = DA.GetDataset("datos", query, ref datos).Trim();

                if (!string.IsNullOrEmpty(_MessageError))
                    throw new ArgumentException(_MessageError);

                jsonRespuesta = JsonConvert.SerializeObject(datos.Tables["datos"]);
                return "";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public string Clientes_Load(int empresa_id, ref string jsonRespuesta, IConfiguration configuration)
        {
            string constring = configuration.GetConnectionString("Conexion");
            string _MessageError = "";
            TDataAccess DA = new TDataAccess(constring);
            DataSet datos = new DataSet();

            try
            {
                string query = "exec Clientes_Load " + empresa_id;
                _MessageError = DA.GetDataset("datos", query, ref datos).Trim();

                if (!string.IsNullOrEmpty(_MessageError))
                    throw new ArgumentException(_MessageError);

                jsonRespuesta = JsonConvert.SerializeObject(datos.Tables["datos"]);
                return "";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public string Clientes_Select(int empresa_id, int cliente_id, ref string jsonRespuesta, IConfiguration configuration)
        {
            string constring = configuration.GetConnectionString("Conexion");
            string _MessageError = "";
            TDataAccess DA = new TDataAccess(constring);
            DataSet datos = new DataSet();

            try
            {
                string query = "exec Clientes_Select " + empresa_id + ", " + cliente_id;
                _MessageError = DA.GetDataset("datos", query, ref datos).Trim();

                if (!string.IsNullOrEmpty(_MessageError))
                    throw new ArgumentException(_MessageError);

                jsonRespuesta = JsonConvert.SerializeObject(datos.Tables["datos"]);
                return "";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        public string Clientes_Insert(string pCliente, IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("Conexion");
            string _MessageError = "";
            TDataAccess DA = new TDataAccess(connectionString);

            try
            {
                var cliente = JsonConvert.DeserializeObject<TClientes>(pCliente);
                if (cliente == null)
                    throw new ArgumentException("JSON inválido");

                string sCliente = JsonConvert.SerializeObject(cliente).Replace("'", "''");

                DA.TransactionBegin();

                string query = "exec Clientes_Insert '" + sCliente + "'";
                _MessageError = DA.ExecuteQuery(query).Trim();

                if (!string.IsNullOrEmpty(_MessageError))
                    throw new ArgumentException(_MessageError);

                DA.TransactionCommit();
                return "";
            }
            catch (Exception ex)
            {
                DA.TransactionRollback();
                return ex.Message;
            }
        }

        public string Clientes_Update(string pCliente, IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("Conexion");
            string _MessageError = "";
            TDataAccess DA = new TDataAccess(connectionString);

            try
            {
                var cliente = JsonConvert.DeserializeObject<TClientes>(pCliente);
                if (cliente == null)
                    throw new ArgumentException("JSON inválido");

                string sCliente = JsonConvert.SerializeObject(cliente).Replace("'", "''");

                DA.TransactionBegin();

                string query = "exec Clientes_Update '" + sCliente + "'";
                _MessageError = DA.ExecuteQuery(query).Trim();

                if (!string.IsNullOrEmpty(_MessageError))
                    throw new ArgumentException(_MessageError);

                DA.TransactionCommit();
                return "";
            }
            catch (Exception ex)
            {
                DA.TransactionRollback();
                return ex.Message;
            }
        }

        public string Clientes_Delete(string pCliente, IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("Conexion");
            string _MessageError = "";
            TDataAccess DA = new TDataAccess(connectionString);

            try
            {
                DA.TransactionBegin();

                string query = "exec Clientes_Delete '" + pCliente + "'";
                _MessageError = DA.ExecuteQuery(query).Trim();

                if (!string.IsNullOrEmpty(_MessageError))
                    throw new ArgumentException(_MessageError);

                DA.TransactionCommit();
                return "";
            }
            catch (Exception ex)
            {
                DA.TransactionRollback();
                return ex.Message;
            }
        }
    }
}
