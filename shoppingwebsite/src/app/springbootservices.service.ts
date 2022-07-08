import { ShippingAdd } from './_models/shippingadd';
import { map, share, shareReplay } from 'rxjs/operators';
import { HttpClient , HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { Product } from './_models/product';
import { Category } from './_models/category';
import { Cart } from './_models/cart';
import { AllOrders, AllUserOrders, Orders } from './_models/orders';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

const httpOptionstext = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json','responseType': 'text' })
};

@Injectable()
export class SpringbootservicesService {
 cartsuject: Subject<Cart>;
 navbarcollapse: Subject<boolean>;

  constructor(private http: HttpClient) {
    this.cartsuject=new Subject<Cart>();
    this.navbarcollapse=new Subject<boolean>();
  }

  getCategoryList():Observable<Category[]>   {
    return this.http.get<Category[]>(`${environment.apiUrl}services/productcategory/getlist`,httpOptions);
}
getproductwithid(productid :String) :Observable<Product>  {
  return this.http.get<Product>(`${environment.apiUrl}services/products/getproductwithid/`+productid,httpOptions);
}

   getProductList() :Observable<Product[]>  {
    return this.http.get<Product[]>(`${environment.apiUrl}services/getproducts/getlist`,httpOptions);

 }
 getCart(cartid :String):Observable<Cart>   {
  return this.http.get<Cart>(`${environment.apiUrl}services/shoppingcart/getcart/`+cartid,httpOptions);
}
clearcart(cartid :String):Observable<Cart>   {
  return this.http.get<Cart>(`${environment.apiUrl}services/shoppingcart/clearcart/`+cartid,httpOptions);
}


 createorupdatecart(productform: Product, cartid:string):Observable<Cart> {
  return this.http.post<Cart>(`${environment.apiUrl}services/shoppingcart/createorupdate`, {
    productid: productform.productid,
    quantity:productform.quantity,
    cartid:cartid
   }, httpOptions);

 }

savenewproduct(productform: Product) : Observable<any> {
  return this.http.post(`${environment.apiUrl}services/products/save`, {
    title: productform.title,
    price: productform.price,
    category: productform.category,
    imageurl: productform.imageurl,
    productid: productform.productid
   }, httpOptions);
}

placeorder(orderform: ShippingAdd, cartid:string) : Observable<any> {
  return this.http.post<any>(`${environment.apiUrl}services/orders/createorder`, {
  name :orderform.name,
  addline1: orderform.addline1,
  addline2:orderform.addline2,
  city:orderform.city,
  state:orderform.state,
  zipcode:orderform.zipcode,
  cartid:cartid
   },httpOptions);
}
getOrder(orderid :String):Observable<Orders>   {
  return this.http.get<Orders>(`${environment.apiUrl}services/orders/getorderdetails/`+orderid,httpOptions);
}

getalluserorders():Observable<AllUserOrders[]>   {
  return this.http.get<AllUserOrders[]>(`${environment.apiUrl}services/orders/getalluserorders`,httpOptions);
}

getallorders():Observable<AllOrders[]>   {
  return this.http.get<AllOrders[]>(`${environment.apiUrl}services/orders/getallorders`,httpOptions);
}

deleteproduct(productform: Product) : Observable<any> {
  return this.http.post(`${environment.apiUrl}services/products/delete`, {
    title: productform.title,
    price: productform.price,
    category: productform.category,
    imageurl: productform.imageurl,
    productid: productform.productid
   }, httpOptions);
}


}
