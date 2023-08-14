using Microsoft.AspNetCore.Mvc;
using System.Data;
using System.Data.SqlClient;
using Proyecto_2.CDomain;
using Microsoft.AspNetCore.Mvc.Infrastructure;

namespace Proyecto_2.Controllers
{
    public class ProductProcedure : Controller
    {
        SqlConnection con;
        public ProductProcedure()
        {
            con = new SqlConnection("Data Source = DK-G\\SQLEXPRESS; initial Catalog = db_compstore; Integrated Security = true");
        }
        public string AlertProduct()
        {
            string result = "";
            try
            {
                con.Open();
                SqlCommand com = con.CreateCommand();
                com.Connection = con;
                com.CommandType = CommandType.StoredProcedure;
                com.CommandText = "alertProduct";
                SqlDataReader reader = com.ExecuteReader();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        result += Convert.ToString(reader.GetInt32(0)) + "+" + reader.GetString(1) + "+" + Convert.ToString(reader.GetInt32(2)) + "*";
                    }
                }
                else
                {
                    result = "empty";
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
        public string DeleteProduct(int codP)
        {
            string result = "";
            con.Open();
            try
            {
                SqlCommand com = con.CreateCommand();
                com.Connection = con;
                com.CommandType = CommandType.StoredProcedure;
                com.CommandText = "deleteProduct";
                com.Parameters.AddWithValue("codP",codP);
                result = Convert.ToString(com.ExecuteNonQuery());
			}
            catch (Exception ex) {
                //result = ex.Message;
                result = "error";
            }
            finally { con.Close(); }
            return result;
        }
        public string UpdateProductField(int codP, string field, string value)
        {
			string result = "";
			try
			{
				con.Open();
				SqlCommand com = con.CreateCommand();
				com.Connection = con;
				com.CommandType = CommandType.StoredProcedure;
				com.CommandText = "updateFieldProduct";
				com.Parameters.AddWithValue("cod", codP);
				com.Parameters.AddWithValue("field", field);
				com.Parameters.AddWithValue("value", value);
				result = Convert.ToString(com.ExecuteNonQuery());
			}
			catch (Exception ex)
			{
                result = ex.Message;
                //result = "error";
			}
			finally { con.Close(); }
			return result;
		}
        public string LoadProduct(string mod)
        {
            string result = "";
            try
            {
                con.Open();
                SqlCommand com = con.CreateCommand();
                com.Connection = con;
                com.CommandType = CommandType.StoredProcedure;
                com.CommandText = "checkProduct";
                com.Parameters.AddWithValue("mod",mod);
                SqlDataReader reader = com.ExecuteReader();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        result += Convert.ToString(reader.GetInt32(0)) + "+" + reader.GetString(1) + "+" + reader.GetString(2) + "+" + Convert.ToString(reader.GetInt32(3));
                        result += "+" + Convert.ToString(reader.GetInt32(4)) + "+" + Convert.ToString(reader.GetInt32(5)) + "+" + Convert.ToString(reader.GetInt32(6)) + "*";
                    }
                }
            }
            catch(Exception e)
            {
                //result = e.Message;
                result = "error";
            }
            finally { con.Close(); }
            return result;
        }
        public string UpdateProduct(Product product,int mod)
        {
            string result = "";
            try
            {
                con.Open();
                SqlCommand com = con.CreateCommand();
                com.Connection = con;
                com.CommandType = CommandType.StoredProcedure;
                com.CommandText = "updateProduct";
                com.Parameters.AddWithValue("codP", product.Id);
                com.Parameters.AddWithValue("countInOrOut", product.Stock);
                com.Parameters.AddWithValue("modUpdate", mod);
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
        public string InsertProduct(Product product)
        {
            string result = "";
            try
            {
                con.Open();
                SqlCommand com = con.CreateCommand();
                com.Connection = con;
                com.CommandType = CommandType.StoredProcedure;
                com.CommandText = "insertNewProduct";
                com.Parameters.AddWithValue("codP", product.Id);
                com.Parameters.AddWithValue("name", product.Name);
                com.Parameters.AddWithValue("unit", product.Unit);
                com.Parameters.AddWithValue("price", product.Price);
                com.Parameters.AddWithValue("minStock", product.MinStock);
                com.Parameters.AddWithValue("maxStock", product.MaxStock);
                com.Parameters.AddWithValue("stock", product.Stock);
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
        public string CheckNameProduct(Product product)
        {
            string result = "";
            try
            {
                con.Open();
                SqlCommand com = con.CreateCommand();
                com.Connection = con;
                com.CommandType = CommandType.StoredProcedure;
                com.CommandText = "checkNameProduct";
                com.Parameters.AddWithValue("name",product.Name);
                SqlDataReader reader = com.ExecuteReader();
                if (reader.HasRows)
                {
                    while (reader.Read())
                    {
                        if(reader.GetString(1) == "exist")
                        {
                            result = Convert.ToString(reader.GetInt32(0)) + "+" + "exist" + "+" + Convert.ToString(reader.GetInt32(2));
                        }
                        else
                        {
                            result = Convert.ToString(reader.GetInt32(0)) + "+not" + "+" + Convert.ToString(reader.GetInt32(2));
                        }
                    }
                }
                else
                {
                    result = 0 + "+not" + "+" + 0;
                }
            }
            catch(Exception ex)
            {
                //result = ex.Message;
                result = "error";
            }
            finally { con.Close(); }
            return result;
        }
    }
}
