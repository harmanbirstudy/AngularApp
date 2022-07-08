import { Product } from './../_models/product';
import { Component, OnInit } from '@angular/core';
import { SpringbootservicesService } from '../springbootservices.service';
import { Cart } from '../_models/cart';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  errorMessage = '';
  cart:Cart;
  cartItemCount:number =0;
  totalPrice:number=0;

  constructor(private backendServices : SpringbootservicesService) {
  //  console.log("Inside shopping constrcutor");
  }

  ngOnInit(): void {
    this.backendServices.navbarcollapse.next(false);
  //  console.log("Inside shopping init");
    this.getCart();
  }
 getItemTotalPrice(product: Product){
  return product.quantity*product.price;
 }


  getCart(){
    let cartId=localStorage.getItem('cartId');
    if(cartId){
      this.backendServices.getCart(cartId).subscribe(
        data => {
        this.cart=data;
        this.updateTotalPriceAndQuntity();
        },
        err => {
          console.log(err);
          this.errorMessage = err.error.message;
        }
      );

    }

  }

  clearCart(){
    let cartId=localStorage.getItem('cartId');
    if(cartId){
      this.backendServices.clearcart(cartId).subscribe(
        data => {
        // console.log(data);
        this.cart=data;
        this.cartItemCount=0;
        this.totalPrice=0;
        this.backendServices.cartsuject.next(this.cart);
        },
        err => {
          console.log(err);
          this.errorMessage = err.error.message;
        }
      );

    }

  }

  addToCart(product:Product){
    let cartId=localStorage.getItem('cartId');
    product.quantity=(product.quantity||0)+1;
    if(!cartId){
      this.createorupdatecart(product,"");
      localStorage.setItem('cartId',this.cart.cartid);
    }else{
      this.createorupdatecart(product,cartId);
    }
}


removeFromCart(product:Product){
  let cartId=localStorage.getItem('cartId');
  product.quantity=(product.quantity||0)-1;
  if(cartId){
    this.createorupdatecart(product,cartId);
  }
}


createorupdatecart(productform: Product, cartid:string){
  this.backendServices.createorupdatecart(productform,cartid).subscribe(
    data => {
      this.cart=data;
      this.updateTotalPriceAndQuntity();
      this.backendServices.cartsuject.next(this.cart);
    },
    err => {
      console.log(err);
      this.errorMessage = err.error.message;
    }
  );
}

updateTotalPriceAndQuntity(){
  this.cartItemCount=0;
  this.totalPrice=0;
  for(let productlist  in this.cart.products){
   this.cartItemCount += this.cart.products[productlist].quantity;
   this.totalPrice+=this.cart.products[productlist].quantity*this.cart.products[productlist].price;
  }

}

}
