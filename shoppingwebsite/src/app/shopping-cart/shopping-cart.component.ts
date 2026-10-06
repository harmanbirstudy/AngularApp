import { Product } from './../_models/product';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SpringbootservicesService } from '../springbootservices.service';
import { Cart } from '../_models/cart';
import { ProductRecommendationsComponent } from '../product-recommendations/product-recommendations.component';
import { Recommendation } from '../_models/recommendation';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-shopping-cart',
  imports: [RouterLink, CurrencyPipe, ProductRecommendationsComponent],
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss']
})
export class ShoppingCartComponent implements OnInit {
  errorMessage = '';
  cart:Cart;
  cartItemCount:number =0;
  totalPrice:number=0;
  cartProductIds:string[]=[];

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
        this.cartProductIds=[];
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
    }else{
      this.createorupdatecart(product,cartId);
    }
}


addRecommendedToCart(rec:Recommendation){
  const inCart=this.cart?.products?.find(p => p.productid===rec.productid);
  this.addToCart(inCart ?? {
    productid: rec.productid,
    title: rec.title,
    category: rec.category,
    price: rec.price,
    imageurl: rec.imageurl ?? '',
    quantity: 0
  });
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
      if(!cartid){
        localStorage.setItem('cartId',this.cart.cartid);
      }
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
  this.cartProductIds=(this.cart?.products ?? []).map(p => p.productid);
  for(let productlist  in this.cart.products){
   this.cartItemCount += this.cart.products[productlist].quantity;
   this.totalPrice+=this.cart.products[productlist].quantity*this.cart.products[productlist].price;
  }

}

}
