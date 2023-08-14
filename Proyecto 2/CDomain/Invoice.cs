namespace Proyecto_2.CDomain
{
    public class Invoice
    {
        private int id;
        private string dateOrder;
        private string dateDeliver;
        private string enterprise;
        private string nameDeliver;
        private string nameReceiver;
        private int codP;
        private int countIn;

        public Invoice(int id, string dateOrder, string dateDeliver, string enterprise, string nameDeliver, string nameReceiver)
        {
            this.id = id;
            this.dateOrder = dateOrder;
            this.dateDeliver = dateDeliver;
            this.enterprise = enterprise;
            this.nameDeliver = nameDeliver;
            this.nameReceiver = nameReceiver;
        }
        public Invoice(int id, int codP, int countIn)
        {
            this.id=id;
            this.codP = codP;
            this.countIn = countIn;
            this.dateOrder = "";
            this.dateDeliver = "";
            this.enterprise = "";
            this.nameDeliver = "";
            this.nameReceiver = "";
        }
        public Invoice()
        {
            this.id = 0;
            this.dateOrder = "";
            this.dateDeliver = "";
            this.enterprise = "";
            this.nameDeliver = "";
            this.nameReceiver = "";
        }
        public int Id { get => id; set => id = value; }
        public string DateOrder { get => dateOrder; set => dateOrder = value; }
        public string DateDeliver { get => dateDeliver; set => dateDeliver = value; }
        public string Enterprise { get => enterprise; set => enterprise = value; }
        public string NameDeliver { get => nameDeliver; set => nameDeliver = value; }
        public string NameReceiver { get => nameReceiver; set => nameReceiver = value; }
        public int CodP { get => codP; set => codP = value; }
        public int CountIn { get => countIn; set => countIn = value; }
    }
}
