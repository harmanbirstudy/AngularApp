import { BsNavbarComponent } from './../bs-navbar/bs-navbar.component';
//import { Product } from 'src/app/_models/product';
import { ActivatedRoute, Router,NavigationEnd } from '@angular/router';
import { Component, EventEmitter, OnInit, Output, OnDestroy } from '@angular/core';
import { SpringbootservicesService } from '../springbootservices.service';
import { Product } from '../_models/product';
import { Category } from '../_models/category';
import { Cart } from '../_models/cart';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products:Product []=[];
  filteredProducts:Product []=[];
  errorMessage = '';
  categoryList : Category[];
  category : string;
  cart:Cart;

  constructor(private backendServices : SpringbootservicesService,private route:ActivatedRoute) {

//console.log("Inside product constructor");

  }


  addToCart(product:Product){
      let cartId=localStorage.getItem('cartId');
      product.quantity=(product.quantity||0)+1;
      if(!cartId){
        this.createorupdatecart(product,"");
       // localStorage.setItem('cartId',this.cart.cartid);
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
  ngOnInit(): void {

    this.backendServices.navbarcollapse.next(false);
    this.getProucts();

    this.getCategories();

    this.getCart();

  }

  createorupdatecart(productform: Product, cartid:string){
    this.backendServices.createorupdatecart(productform,cartid).subscribe(
      data => {
        this.cart=data;
       // console.log(this.cart);
        if(!cartid){
          localStorage.setItem('cartId',this.cart.cartid);
        }
        this.updatequantity();
        this.backendServices.cartsuject.next(this.cart);
      },
      err => {
        console.log(err);
        this.errorMessage = err.error.message;
      }
    );
  }

  updatequantity(){
    if(this.cart){
      this.cart.products.forEach( (element) => {
       let objIndex = this.products.findIndex((obj => obj.productid == element.productid));
       this.products[objIndex].quantity=element.quantity;
    });
    }
  }

  getProucts(){
    this.backendServices.getProductList().subscribe(
      data => {
        this.products=data;
        this.route.queryParamMap.subscribe(params=>{
          this.category=params.get('category');
          this.filteredProducts=(this.category)?
          this.products.filter(p=>p.category===this.category):
          this.products;
        });
      },
      err => {
        console.log(err);
        this.errorMessage = err.error.message;
      }
    );

  }

  getCategories(){
    this.backendServices.getCategoryList().subscribe(
      data => {
        this.categoryList=data;
      },
      err => {
        console.log(err);
        this.errorMessage = err.error.message;
      }
    );
  }

  getCart(){
    let cartId=localStorage.getItem('cartId');
    if(cartId){
      this.backendServices.getCart(cartId).subscribe(
        data => {
       //   console.log(data);
        this.cart=data;
       // localStorage.setItem('cartId',this.cart.cartid);
        this.updatequantity();
   //     this.routerNavigate();
        },
        err => {
          console.log(err);
          this.errorMessage = err.error.message;
        }
      );
    }

  }
}
