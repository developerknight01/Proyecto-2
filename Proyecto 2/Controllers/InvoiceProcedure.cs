using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using Proyecto_2.CDomain;
namespace Proyecto_2.Controllers
{
    public class InvoiceProcedure : Controller
    {
        SqlConnection con;
        public InvoiceProcedure()
        {
            con = new SqlConnection("Data Source = DK-G\\SQLEXPRESS; initial Catalog = db_compstore; Integrated Security = true");
        }
        public int InsertNewOrderDeliver(Invoice invoice, Product product)
        {
            int result = 0;
            try
            {
                con.Open();
                SqlCommand com = con.CreateCommand();
                com.Connection = con;
                com.CommandType = CommandType.StoredProcedure;
                com.CommandText = "insertNewOrderDeliver";
                com.Parameters.AddWithValue("id",invoice.Id);
				com.Parameters.AddWithValue("codP",product.Id);
				com.Parameters.AddWithValue("unit",product.Unit);
				com.Parameters.AddWithValue("price",product.Price);
				com.Parameters.AddWithValue("countOut",product.Stock);
				com.Parameters.AddWithValue("dateOrder",invoice.DateOrder);
                result = com.ExecuteNonQuery();
			}
            catch (Exception ex)
            {
                result = -1;
            }
            finally { con.Close(); }
            return result;
        }
        public string CheckLastOrderDeliver()
        {
            string result = "";
            try
            {
                con.Open();
                SqlCommand com = con.CreateCommand();
                com.Connection = con;
                com.CommandType = CommandType.StoredProcedure;
                com.CommandText = "checkLastOrderDeliver";
                SqlDataReader reader = com.ExecuteReader();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        result = Convert.ToString(reader.GetInt32(0));
                    }
                }

			}
            catch (Exception ex)
            {
                //result = ex.Message;
                result = "error";
            }
            finally { con.Close(); }
            return result;
        }
        public string InsertInvoiceDetail(Invoice invoice)
        {
            string result = "";
            try
            {
                con.Open();
                SqlCommand com = con.CreateCommand();
                com.Connection = con;
                com.CommandType = CommandType.StoredProcedure;
                com.CommandText = "insertDetailOrder";
                com.Parameters.AddWithValue("id", invoice.Id);
                com.Parameters.AddWithValue("codP", invoice.CodP);
                com.Parameters.AddWithValue("countIn", invoice.CountIn);
                result = Convert.ToString(com.ExecuteNonQuery());
            }
            catch (Exception ex)
            {
                //result = ex.Message;
                result = "error";
            }
            finally { con.Close(); }
            return result;
        }
        public string InsertInvoice(Invoice invoice)
        {
            string result = "";
            try
            {
                con.Open();
                SqlCommand com = con.CreateCommand();
                com.Connection = con;
                com.CommandType = CommandType.StoredProcedure;
                com.CommandText = "insertNewOrder";
                com.Parameters.AddWithValue("id", invoice.Id);
                com.Parameters.AddWithValue("dateOrder", invoice.DateOrder);
                com.Parameters.AddWithValue("dateDeliver", invoice.DateDeliver);
                com.Parameters.AddWithValue("enterprise", invoice.Enterprise);
                com.Parameters.AddWithValue("nameDeliver", invoice.NameDeliver);
                com.Parameters.AddWithValue("nameReceiver", invoice.NameReceiver);
                result = Convert.ToString(com.ExecuteNonQuery());
            }
            catch (Exception ex)
            {
                //result = ex.Message;
                result = "error";
            }
            finally { con.Close(); }
            return result;
        }    
    }
}
