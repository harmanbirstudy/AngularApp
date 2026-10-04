import { AllOrders } from './../../_models/orders';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Config } from 'datatables.net-dt';
import { DataTableDirective } from '../../_directives/datatable.directive';
import { SpringbootservicesService } from '../../springbootservices.service';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-admin-orders',
  imports: [RouterLink, DataTableDirective],
  providers: [DatePipe],
  templateUrl: './admin-orders.component.html',
  styleUrls: ['./admin-orders.component.scss']
})
export class AdminOrdersComponent implements OnInit,OnDestroy {
  errorMessage = '';
  orders:AllOrders[];
  dtOptions: Config = {};
  dtTrigger = new ReplaySubject<void>(1);

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
      layout: { bottomEnd: { paging: { type: 'full_numbers' } } },
      pageLength: 10
    };
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.complete();
  }

  transformDate(date:Date) {
    return this.datePipe.transform(date, 'MMM d, y, h:mm:ss a');
  }

}
