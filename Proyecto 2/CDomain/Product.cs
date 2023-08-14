namespace Proyecto_2.CDomain
{
    public class Product
    {
        private int id;
        private string name;
        private int price;
        private string unit;
        private int minStock;
        private int maxStock;
        private int stock;
        public int Id { get { return id; } set { id = value; } }
        public string Name { get { return name; } set { name = value; } }
        public int Price { get { return price; } set { price = value; } }
        public string Unit { get { return unit; } set { unit = value; } }
        public int MinStock { get {  return minStock; } set {  minStock = value; } }
        public int MaxStock { get { return maxStock; } set { maxStock = value; } }
        public int Stock { get {  return stock; } set {  stock = value; } }
        public Product(int id = 0, string name = null, int price = 0, string unit = null, int minStock = 0, int maxStock = 0, int stock = 0)
        {
            this.id = id;
            this.name = name;
            this.price = price;
            this.unit = unit;
            this.minStock = minStock;
            this.maxStock = maxStock;
            this.stock = stock;
        }

    }
}
