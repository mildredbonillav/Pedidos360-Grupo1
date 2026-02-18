using Newtonsoft.Json;
using System.Data;

namespace Pedidos360.Models
{
    public class TProductos
    {
        public int empresa_id { get; set; }
        public int producto_id { get; set; }
        public int categoria_id { get; set; }
        public int tipo_impuesto_id { get; set; }
        public string nombre { get; set; }
        public decimal precio { get; set; }
        public int stock { get; set; }
        public string imagen_base64 { get; set; } 
        public bool activo { get; set; }

        // ================= LOADS =================

        public string Productos_Load(int empresa_id, ref string jsonRespuesta, IConfiguration configuration)
        {
            string constring = configuration.GetConnectionString("Conexion");
            string _MessageError = "";
            TDataAccess DA = new TDataAccess(constring);
            DataSet datos = new DataSet();

            try
            {
                string query = "exec Productos_Load " + empresa_id;
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

        public string Productos_Select(int empresa_id, int producto_id, ref string jsonRespuesta, IConfiguration configuration)
        {
            string constring = configuration.GetConnectionString("Conexion");
            string _MessageError = "";
            TDataAccess DA = new TDataAccess(constring);
            DataSet datos = new DataSet();

            try
            {
                string query = "exec Productos_Select " + empresa_id + ", " + producto_id;
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

        // ================= COMBOS =================

        public string Categorias_Load(int empresa_id, ref string jsonRespuesta, IConfiguration configuration)
        {
            string constring = configuration.GetConnectionString("Conexion");
            string _MessageError = "";
            TDataAccess DA = new TDataAccess(constring);
            DataSet datos = new DataSet();

            try
            {
                string query = "exec Categorias_Load " + empresa_id;
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

        public string Tipos_Impuestos_Load(int empresa_id, ref string jsonRespuesta, IConfiguration configuration)
        {
            string constring = configuration.GetConnectionString("Conexion");
            string _MessageError = "";
            TDataAccess DA = new TDataAccess(constring);
            DataSet datos = new DataSet();

            try
            {
                string query = "exec Tipos_Impuestos_Load " + empresa_id;
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

        // ================= CRUD =================

        public string Productos_Insert(string pProducto, IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("Conexion");
            string _MessageError = "";
            TDataAccess DA = new TDataAccess(connectionString);

            try
            {
                var producto = JsonConvert.DeserializeObject<TProductos>(pProducto);

                string sProducto = JsonConvert.SerializeObject(producto);
                sProducto = sProducto.Replace("'", "''");

                DA.TransactionBegin();

                string query = "exec Productos_Insert '" + sProducto + "'";
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

        public string Productos_Update(string pProducto, IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("Conexion");
            string _MessageError = "";
            TDataAccess DA = new TDataAccess(connectionString);

            try
            {
                var producto = JsonConvert.DeserializeObject<TProductos>(pProducto);

                string sProducto = JsonConvert.SerializeObject(producto);
                sProducto = sProducto.Replace("'", "''");

                DA.TransactionBegin();

                string query = "exec Productos_Update '" + sProducto + "'";
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

        public string Productos_Delete(string pProducto, IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("Conexion");
            string _MessageError = "";
            TDataAccess DA = new TDataAccess(connectionString);

            try
            {
                DA.TransactionBegin();

                string query = "exec Productos_Delete '" + pProducto.Replace("'", "''") + "'";
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
