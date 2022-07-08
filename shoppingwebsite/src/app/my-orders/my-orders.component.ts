import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { SpringbootservicesService } from '../springbootservices.service';
import { AllUserOrders } from '../_models/orders';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit,OnDestroy {
  errorMessage = '';
  userorders:AllUserOrders[];
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private backendServices : SpringbootservicesService,private datePipe: DatePipe) {
    backendServices.getalluserorders().subscribe(
      data => {
        this.userorders=data;
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
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };
    this.backendServices.navbarcollapse.next(false);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  transformDate(date:Date) {
    return this.datePipe.transform(date, 'MMM d, y, h:mm:ss a');
  }
}
