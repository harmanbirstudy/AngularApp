import { User } from './../_models/user';
//import { UserService } from './../_services/user.service';
import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';
//import { BehaviorSubject, Observable } from 'rxjs';
import { AuthenticationService } from '../_services/authentication.service';
import { Cart } from '../_models/cart';
import { SpringbootservicesService } from '../springbootservices.service';
import { Observable, Subscription } from 'rxjs';
//import { ProductsComponent } from '../products/products.component';

@Component({
  selector: 'bs-navbar',
  templateUrl: './bs-navbar.component.html',
  styleUrls: ['./bs-navbar.component.scss']
})
export class BsNavbarComponent implements OnInit {
  isCollapsed :boolean= false;
  user: User;
  isAdmin: boolean=false;
  errorMessage = '';
  cart:Cart;
  cartSubs: Subscription;
  cartItemCount:number =0;

  constructor(private tokenStorage: TokenStorageService, private auth: AuthenticationService,private backendServices : SpringbootservicesService) {

     if (this.tokenStorage.getToken()) {
      console.log("navbar insdide if token storage");
      this.user=this.tokenStorage.getUser();
      this.isAdmin=this.tokenStorage.isAdmin();
      if(!this.user.imageurl){
       // this.user.imageurl="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
       this.user.imageurl='../../assets/images/profilepic.png';
      }
     }
  }

  ngOnInit(): void {
    this.isCollapsed = false;
     this.getCart();
     this.subscribeCartUpdate();
     this.subscribeNavBarCollapse();
  }
  logout() {
    this.auth.logout();
   }

   getCart(){
    let cartId=localStorage.getItem('cartId');
    if(cartId){
      this.backendServices.getCart(cartId).subscribe(
        data => {
        this.cart=data;
        this.cartItemCount=0;
          for(let productlist  in this.cart.products){
           this.cartItemCount += this.cart.products[productlist].quantity;
          }
        },
        err => {
          console.log(err);
          this.errorMessage = err.error.message;
        }
      );

    }

  }
  subscribeCartUpdate(){
    this.cartSubs=this.backendServices.cartsuject.subscribe(cart=>{
      this.cart=cart;
      this.cartItemCount=0;
      if(this.cart){
          for(let productlist  in this.cart.products){
           this.cartItemCount += this.cart.products[productlist].quantity;
          }
        }
     });

  }


  subscribeNavBarCollapse(){
    this.cartSubs=this.backendServices.navbarcollapse.subscribe(iscollapsed=>{
      this.isCollapsed=iscollapsed;
     });

  }
}
