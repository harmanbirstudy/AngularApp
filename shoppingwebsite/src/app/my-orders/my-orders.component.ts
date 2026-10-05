import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { SpringbootservicesService } from '../springbootservices.service';
import { AllUserOrders } from '../_models/orders';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Config } from 'datatables.net-dt';
import { DataTableDirective } from '../_directives/datatable.directive';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-my-orders',
  imports: [RouterLink, DataTableDirective],
  providers: [DatePipe],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.scss']
})
export class MyOrdersComponent implements OnInit,OnDestroy {
  errorMessage = '';
  userorders:AllUserOrders[];
  dtOptions: Config = {};
  dtTrigger = new ReplaySubject<void>(1);

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
      layout: { bottomEnd: { paging: { type: 'full_numbers' } } },
      pageLength: 10
    };
    this.backendServices.navbarcollapse.next(false);
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.complete();
  }

  transformDate(date:Date) {
    return this.datePipe.transform(date, 'MMM d, y, h:mm:ss a');
  }
}
