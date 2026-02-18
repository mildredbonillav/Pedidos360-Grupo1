using System.Data;
using Microsoft.Data.SqlClient;

namespace Pedidos360.Models
{
    public class TDataAccess
    {
        SqlConnection _Conexion;
        public SqlCommand _Command;
        SqlDataAdapter _Adapter;
        SqlTransaction _Transaction;
        string _Mensaje_Error;
        SqlDataReader _Reader;
        public TDataAccess(string _Conexion_String)
        {

            new SqlConnectionStringBuilder(_Conexion_String);


            SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder(_Conexion_String);

            var connString = builder;
            _Conexion = new SqlConnection(_Conexion_String);
            _Command = new SqlCommand();
            _Adapter = new SqlDataAdapter();
            _Mensaje_Error = "";
        }

        public string TransactionBegin()
        {
            try
            {
                _Mensaje_Error = OpenConnection();
                _Mensaje_Error = _Mensaje_Error.Trim();

                if (!String.IsNullOrEmpty(_Mensaje_Error))
                {
                    throw new System.ArgumentException(_Mensaje_Error);
                }

                _Transaction = _Conexion.BeginTransaction();
                return "";
            }
            catch (Exception ex)
            {
                CloseConnection();
                return ex.Message;
            }
        }

        public string TransactionCommit()
        {
            try
            {
                _Transaction.Commit();
                return "";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
            finally
            {
                CloseConnection();
            }
        }

        public string TransactionRollback()
        {
            try
            {
                _Transaction.Rollback();
                return "";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
            finally
            {
                CloseConnection();
            }
        }

        public string OpenConnection()
        {
            try
            {
                if (_Conexion.State == ConnectionState.Closed)
                {
                    _Conexion.Open();
                }
                return "";
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }

        public string CloseConnection()
        {
            try
            {
                if (_Conexion.State == ConnectionState.Open)
                {
                    _Conexion.Close();
                }
                return "";
            }
            catch (Exception e)
            {
                return e.Message;
            }
        }

        public string GetDataset(string tablename, string query, ref DataSet Datos)
        {
            try
            {
                _Command.CommandText = query;
                _Command.Connection = _Conexion;
                _Command.CommandTimeout = 0;
                _Adapter.SelectCommand = _Command;
                _Mensaje_Error = OpenConnection();
                _Mensaje_Error = _Mensaje_Error.Trim();

                if (!String.IsNullOrEmpty(_Mensaje_Error))
                {
                    throw new System.ArgumentException(_Mensaje_Error);
                }

                _Adapter.Fill(Datos, tablename);
                return "";
            }
            catch (Exception e)
            {
                return e.Message;
            }
            finally
            {
                _Conexion.Close();
            }

        }

        public DateTime GetDateValue(string Query)
        {
            try
            {
                DateTime valor;
                _Command.Connection = _Conexion;
                _Command.CommandText = Query;
                _Command.Transaction = _Transaction;
                valor = System.Convert.ToDateTime(_Command.ExecuteScalar());

                return valor;
            }
            catch
            {
                return DateTime.Now;
            }
        }

        public string ExecuteQuery(string Query)
        {
            try
            {
                _Command.Connection = _Conexion;
                _Command.CommandText = Query;
                _Command.CommandTimeout = 0;
                _Command.Transaction = _Transaction;
                _Command.CommandType = CommandType.Text;
                _Command.ExecuteNonQuery();
                return "";
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }


    }
}