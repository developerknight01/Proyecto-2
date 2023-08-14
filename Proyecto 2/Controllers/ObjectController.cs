using Microsoft.AspNetCore.Mvc;
using Proyecto_2.CDomain;
namespace Proyecto_2.Controllers
{
    public class ObjectController : Controller
    {
        public IActionResult RowItem() { return View(); }
        public IActionResult ModalMessage()
        {
            return View();
        }
        public IActionResult Modal()
        {
            return View();
        }
        [HttpPost]
        public ActionResult AlertProduct()
        {
            return Json(new ProductProcedure().AlertProduct());
        }
        [HttpPost]
        public ActionResult InsertOrderDeliver(int id, int codP,string unit,int price, int countOut,string date)
        {
            Product product = new Product();
            product.Id = codP;
            product.Unit = unit;
            product.Price = price;
            product.Stock = countOut;
            Invoice invoice = new Invoice();
            invoice.Id = id;
            invoice.DateOrder = date;
            if(new InvoiceProcedure().InsertNewOrderDeliver(invoice,product) != -1)
            {
				return Json(new ProductProcedure().UpdateProduct(product, 0));
            }
            else
            {
                return Json("error");
            }
		}
        [HttpPost]
        public ActionResult CheckLastOrderDeliver()
        {
            return Json(new InvoiceProcedure().CheckLastOrderDeliver());
        }
		[HttpPost]
        public ActionResult DeleteProduct(int cod)
        {
            return Json(new ProductProcedure().DeleteProduct(cod));
        }
		[HttpPost]
        public ActionResult UpdateFieldProduct(int cod, string field, string value)
        {
            return Json(new ProductProcedure().UpdateProductField(cod,field,value));
        }
		[HttpPost]
        public ActionResult CheckProduct(string mod)
        {
            return Json(new ProductProcedure().LoadProduct(mod));
        }
        [HttpPost]
        public ActionResult InsertDetailOrder(string invoice, string codP,string countIn)
        {
            Invoice invoiceDetail = new Invoice(Convert.ToInt32(invoice),Convert.ToInt32(codP),Convert.ToInt32(countIn));
            return Json(new InvoiceProcedure().InsertInvoiceDetail(invoiceDetail));
        }
        [HttpPost]
        public ActionResult InsertProduct(string id, string name, string unit, string price, string minStock, string maxStock, string stock, string mod)
        {
            Product product = new Product(Convert.ToInt32(id),name, Convert.ToInt32(price),unit,Convert.ToInt32(minStock),Convert.ToInt32(maxStock),Convert.ToInt32(stock));
            if(mod == "1")
                return Json(new ProductProcedure().InsertProduct(product));
            else
            {
                mod = "1";
                return Json(new ProductProcedure().UpdateProduct(product,Convert.ToInt32(mod)));
            }

        }
        [HttpPost]
        public ActionResult CheckNameProduct(string name)
        {
            Product product = new Product();
            product.Name = name;

            return Json(new ProductProcedure().CheckNameProduct(product));
        }
        [HttpPost]
        public ActionResult InsertInvoice(string id, string dateOrder, string dateDeliver, string enterprise, string nameDeliver, string nameReceiver)
        {
            Invoice invoice = new Invoice(Convert.ToInt32(id), dateOrder, dateDeliver, enterprise, nameDeliver, nameReceiver);

            return Json(new InvoiceProcedure().InsertInvoice(invoice));
        }
    }
}
