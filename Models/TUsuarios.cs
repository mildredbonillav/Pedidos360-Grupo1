using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Data;
using System.Security.Cryptography;
using System.Text;

namespace Pedidos360.Models
{
    public class TUsuarios
    {
        public int usuario_id { get; set; }
        public int empresa_id { get; set; }
        public int empresa_id_seleccionada { get; set; }
        public string empresa_nombre_seleccionada { get; set; }
        public int rol_id { get; set; }
        public int rol_id_asignado { get; set; }
        public string rol_nombre_asignado { get; set; }
        public string cedula { get; set; }
        public string nombre { get; set; }
        public string apellidos { get; set; }
        public string correo { get; set; }
        public string contrasena { get; set; }
        public string contrasena_actual { get; set; }
        public bool cambiar_contrasena { get; set; }
        public string telefono { get; set; }
        public string direccion { get; set; }
        public bool activo { get; set; }


        public string Usuarios_Valida_Inicio_Sesion(ref string jsonRespuesta, IConfiguration configuration)
        {
            string constring = configuration.GetConnectionString("Conexion"); // Obtener cadena de conexión
            string _MessageError = "";
            TDataAccess DA = new TDataAccess(constring);
            DataSet datos = new DataSet();

            try
            {
                string contrasenaHash = HashSHA256(contrasena);
                string query = "exec Usuarios_Valida_Inicio_Sesion '" + correo + "', '" + contrasenaHash + "'";
                _MessageError = DA.GetDataset("datos", query, ref datos); // Ejecutar procedimiento almacenado
                _MessageError = _MessageError.Trim();

                if (!String.IsNullOrEmpty(_MessageError))
                {
                    throw new System.ArgumentException(_MessageError);
                }

                jsonRespuesta = JsonConvert.SerializeObject(datos.Tables["datos"]); // Convertir resultado a JSON

                return "";
            }
            catch (Exception ex)
            {
                return ex.Message; // Devolver mensaje de error si falla
            }
        }
        public string Usuarios_Load(int empresa_id, ref string jsonRespuesta, IConfiguration configuration)
        {
            string constring = configuration.GetConnectionString("Conexion"); // Obtener cadena de conexión
            string _MessageError = "";
            TDataAccess DA = new TDataAccess(constring);
            DataSet datos = new DataSet();

            try
            {
                string query = "exec Usuarios_Load " + empresa_id;
                _MessageError = DA.GetDataset("datos", query, ref datos); // Ejecutar procedimiento almacenado
                _MessageError = _MessageError.Trim();

                if (!String.IsNullOrEmpty(_MessageError))
                {
                    throw new System.ArgumentException(_MessageError);
                }

                jsonRespuesta = JsonConvert.SerializeObject(datos.Tables["datos"]); // Convertir resultado a JSON

                return "";
            }
            catch (Exception ex)
            {
                return ex.Message; // Devolver mensaje de error si falla
            }
        }

        public string Roles_Load(int empresa_id, ref string jsonRespuesta, IConfiguration configuration)
        {
            string constring = configuration.GetConnectionString("Conexion"); // Obtener cadena de conexión
            string _MessageError = "";
            TDataAccess DA = new TDataAccess(constring);
            DataSet datos = new DataSet();

            try
            {
                string query = "exec Roles_Load " + empresa_id;
                _MessageError = DA.GetDataset("datos", query, ref datos); // Ejecutar procedimiento almacenado
                _MessageError = _MessageError.Trim();

                if (!String.IsNullOrEmpty(_MessageError))
                {
                    throw new System.ArgumentException(_MessageError);
                }

                jsonRespuesta = JsonConvert.SerializeObject(datos.Tables["datos"]); // Convertir resultado a JSON

                return "";
            }
            catch (Exception ex)
            {
                return ex.Message; // Devolver mensaje de error si falla
            }
        }
        private string HashSHA256(string texto)
        {
            using (SHA256 sha256 = SHA256.Create())
            {
                byte[] bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(texto));
                StringBuilder sb = new StringBuilder();
                foreach (byte b in bytes)
                    sb.Append(b.ToString("x2"));

                return sb.ToString();
            }
        }

        public string Usuarios_Insert(string pUsuario, IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("Conexion");
            string _MessageError = "";
            TDataAccess DA = new TDataAccess(connectionString);

            try
            {
                var usuario = JsonConvert.DeserializeObject<TUsuarios>(pUsuario);
                if (usuario == null)
                    throw new ArgumentException("JSON inválido");

                if (string.IsNullOrWhiteSpace(usuario.contrasena))
                    throw new ArgumentException("Debe indicar una contraseña.");

                usuario.contrasena = HashSHA256(usuario.contrasena);

                string sUsuario = JsonConvert.SerializeObject(usuario);
                sUsuario = sUsuario.Replace("'", "''");

                DA.TransactionBegin();

                string query = "exec Usuarios_Insert '" + sUsuario + "'";
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

        public string Usuarios_Select(int empresa_id, int usuario_id, ref string jsonRespuesta, IConfiguration configuration)
        {
            string constring = configuration.GetConnectionString("Conexion"); // Obtener cadena de conexión
            string _MessageError = "";
            TDataAccess DA = new TDataAccess(constring);
            DataSet datos = new DataSet();

            try
            {
                string query = "exec Usuarios_Select " + empresa_id + ", " + usuario_id;
                _MessageError = DA.GetDataset("datos", query, ref datos); // Ejecutar procedimiento almacenado
                _MessageError = _MessageError.Trim();

                if (!String.IsNullOrEmpty(_MessageError))
                {
                    throw new System.ArgumentException(_MessageError);
                }

                jsonRespuesta = JsonConvert.SerializeObject(datos.Tables["datos"]); // Convertir resultado a JSON

                return "";
            }
            catch (Exception ex)
            {
                return ex.Message; // Devolver mensaje de error si falla
            }
        }


        public string Usuarios_Update(string pUsuario, IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("Conexion");
            string _MessageError = "";
            TDataAccess DA = new TDataAccess(connectionString);

            try
            {
                var usuario = JsonConvert.DeserializeObject<TUsuarios>(pUsuario);
                if (usuario == null)
                    throw new ArgumentException("JSON inválido");

                if (usuario.cambiar_contrasena)
                {
                    if (string.IsNullOrWhiteSpace(usuario.contrasena_actual) ||
                        string.IsNullOrWhiteSpace(usuario.contrasena))
                        throw new ArgumentException("Debe indicar contraseña actual y nueva");

                    usuario.contrasena_actual = HashSHA256(usuario.contrasena_actual);
                    usuario.contrasena = HashSHA256(usuario.contrasena);
                }
                else
                {
                    usuario.contrasena_actual = null;
                    usuario.contrasena = null;
                }

                string sUsuario = JsonConvert.SerializeObject(usuario);
                sUsuario = sUsuario.Replace("'", "''");

                DA.TransactionBegin();

                string query = "exec Usuarios_Update '" + sUsuario + "'";
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
        public string Usuarios_Delete(string pUsuario, IConfiguration configuration)
        {
            string connectionString = configuration.GetConnectionString("Conexion");
            string _MessageError = "";
            TDataAccess DA = new TDataAccess(connectionString);

            try
            {
                
                DA.TransactionBegin();

                string query = "exec Usuarios_Delete '" + pUsuario + "'";
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
