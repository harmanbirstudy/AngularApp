import { Product } from './../../_models/product';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { SpringbootservicesService } from '../../springbootservices.service';
import { ReplaySubject } from 'rxjs';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Config } from 'datatables.net-dt';
import { DataTableDirective } from '../../_directives/datatable.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-admin-products',
  imports: [CurrencyPipe, RouterLink, DataTableDirective],
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss']
})
export class AdminProductsComponent implements OnInit,OnDestroy{
  products:Product [];
  //filteredproducts: Product[];
  //listArray: Mattab
  errorMessage = '';
  dtOptions: Config = {};
  dtTrigger = new ReplaySubject<void>(1);

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
      layout: { bottomEnd: { paging: { type: 'full_numbers' } } },
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
    this.dtTrigger.complete();
  }
}
