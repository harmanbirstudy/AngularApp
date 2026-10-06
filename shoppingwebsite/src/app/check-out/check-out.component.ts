import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpringbootservicesService } from '../springbootservices.service';
import { Cart } from '../_models/cart';
import { Product } from '../_models/product';
import { ShippingAdd } from '../_models/shippingadd';
import { NgbTypeahead, NgbTypeaheadSelectItemEvent } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { AddressAutocompleteService, AddressSuggestion } from '../_services/address-autocomplete.service';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-check-out',
  imports: [FormsModule, CurrencyPipe, NgbTypeahead],
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit {
  errorMessage = '';
  form: ShippingAdd ={
    name:'',
  addline1:'',
  addline2:'',
  city:'',
  state:'',
  zipcode:''
  };
  isSaveFailed = false;
  cart:Cart;
  cartItemCount:number =0;
  totalPrice:number=0;
  searchingAddress = false;
  constructor(private backendServices : SpringbootservicesService,private routes:Router,private route:ActivatedRoute,private addressService: AddressAutocompleteService) {
    this.getCart();
   }

  ngOnInit(): void {

  }
  searchAddress = (text$: Observable<string>): Observable<AddressSuggestion[]> =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(term => this.searchingAddress = term.trim().length >= 3),
      switchMap(term => term.trim().length < 3 ? of([]) :
        this.addressService.search(term).pipe(catchError(() => of([])))),
      tap(() => this.searchingAddress = false)
    );

  formatSuggestion = (s: AddressSuggestion) => s.label;

  onAddressSelect(event: NgbTypeaheadSelectItemEvent<AddressSuggestion>) {
    // keep addline1 a plain string and fill the rest of the form from the suggestion
    event.preventDefault();
    const s = event.item;
    this.form.addline1 = s.addline1;
    this.form.city = s.city;
    this.form.state = s.state;
    this.form.zipcode = s.zipcode;
  }

  getItemTotalPrice(product: Product){
    return product.quantity*product.price;
   }
  onSubmit() {
    // console.log(this.form)

     this.backendServices.placeorder(this.form,this.cart.cartid).subscribe(
       data => {
         if (data) {
           console.log(data);
           localStorage.removeItem('cartId');
           this.backendServices.cartsuject.next(this.cart);
       //  this.isSuccessful = true;
        // this.succesMessage = data.message;
        this.routerNavigate(data.orderid);
         }
       },
       err => {
         this.errorMessage = err.error.message;
         console.log(err);
         this.isSaveFailed = true;
       }
     );
   }


   getCart(){
    let cartId=localStorage.getItem('cartId');
    console.log(cartId);
    if(cartId){
      this.backendServices.getCart(cartId).subscribe(
        data => {
        console.log(data);
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


  updateTotalPriceAndQuntity(){
    this.cartItemCount=0;
    this.totalPrice=0;
    for(let productlist  in this.cart.products){
     this.cartItemCount += this.cart.products[productlist].quantity;
     this.totalPrice+=this.cart.products[productlist].quantity*this.cart.products[productlist].price;
    }

  }


   routerNavigate(orderid:string) {

    this.routes.navigateByUrl('/order-success/'+orderid)
     .then(()=>{
      window.location.reload();
     });

  }



}
