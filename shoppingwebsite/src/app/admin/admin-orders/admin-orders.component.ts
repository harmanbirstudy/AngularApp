import { AllOrders } from './../../_models/orders';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { SpringbootservicesService } from 'src/app/springbootservices.service';

@Component({
  selector: 'app-admin-orders',
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit,OnDestroy {
  errorMessage = '';
  orders:AllOrders[];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private backendServices : SpringbootservicesService,private datePipe: DatePipe) {
    backendServices.getallorders().subscribe(
      data => {
       this.orders=data;
      // console.log(this.userorders);
       this.dtTrigger.next();
      },
      err => {
        console.log(err);
        this.errorMessage = err.error.message;
      }
    );
  }

  ngOnInit(): void {
    this.backendServices.navbarcollapse.next(false);
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  transformDate(date:Date) {
    return this.datePipe.transform(date, 'MMM d, y, h:mm:ss a');
  }

}
