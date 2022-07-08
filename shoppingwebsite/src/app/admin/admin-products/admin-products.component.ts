import { Product } from './../../_models/product';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SpringbootservicesService } from 'src/app/springbootservices.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit,OnDestroy{
  products:Product [];
  //filteredproducts: Product[];
  //listArray: Mattab
  errorMessage = '';
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private backendServices : SpringbootservicesService) {
    //this.products=backendServices.getProductList();

    backendServices.getProductList().subscribe(
      data => {
      //  console.log(data);
       // this.filteredproducts=this.products=data;
        this.products=data;
        this.dtTrigger.next();
      },
      err => {
        console.log(err);
        this.errorMessage = err.error.message;
      }
    );
  }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.backendServices.navbarcollapse.next(false);
  }
  // filter(query:string){
  //   this.filteredproducts=(query)? this.products.filter(p=>p.title.toLowerCase().includes(query.toLowerCase())):this.products;
  //  // console.log(query);
  // }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
