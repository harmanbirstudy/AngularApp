export interface Orders{
  userid :string;
  orderid: string;
  orderdate:Date;
  name :string;
  addline1: string;
  addline2 :string;
  city: string;
  state: string;
  zipcode: string;
  products:OrderProducts[]

}

export interface OrderProducts{
  title :string;
  price :number;
  imageurl :string;
  quantity:number;

}

export interface AllUserOrders{
  orderid: string;
  orderdate:Date;
}


export interface AllOrders{
  orderid: string;
  name: string;
  orderdate:Date;
}
