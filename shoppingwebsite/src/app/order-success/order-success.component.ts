import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SpringbootservicesService } from '../springbootservices.service';
import { OrderProducts, Orders } from '../_models/orders';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.scss']
})
export class OrderSuccessComponent implements OnInit {

  order: Orders;
  isSaveFailed = false;
  errorMessage = '';
  totalPrice:number=0;

  constructor(private backendServices : SpringbootservicesService,private routes:Router,private route:ActivatedRoute) {

    let orderid=this.route.snapshot.paramMap.get('orderid');
    if(orderid){
      backendServices.getOrder(orderid).subscribe(
        data => {
       //   console.log(data);
          this.order=data;
         // console.log(this.order);
          this.updateTotalPriceAndQuntity();
        },
        err => {
          console.log(err);
          this.errorMessage = err.error.message;
        }
      );
      }
  }

  ngOnInit(): void {

  }

  getItemTotalPrice(product: OrderProducts){
    return product.quantity*product.price;
   }


   updateTotalPriceAndQuntity(){
    this.totalPrice=0;
    for(let productlist  in this.order.products){
     this.totalPrice+=this.order.products[productlist].quantity*this.order.products[productlist].price;
    }

  }
}
