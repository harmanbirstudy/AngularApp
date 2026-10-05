import { afterNextRender, Directive, ElementRef, inject, Injector, input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import DataTable, { Api, Config } from 'datatables.net-dt';

// Replacement for the unmaintained angular-datatables package: same
// `datatable [dtOptions] [dtTrigger]` template API, backed by DataTables 3
// (which no longer needs jQuery). Emit on dtTrigger once the rows are bound.
@Directive({
  selector: 'table[datatable]'
})
export class DataTableDirective implements OnInit, OnDestroy {
  readonly dtOptions = input<Config>({});
  readonly dtTrigger = input<Observable<unknown>>();

  private readonly el = inject<ElementRef<HTMLTableElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private table?: Api<any>;
  private triggerSub?: Subscription;

  ngOnInit(): void {
    this.triggerSub = this.dtTrigger()?.subscribe(() => {
      // wait until Angular has rendered the new rows into the table
      afterNextRender(() => this.render(), { injector: this.injector });
    });
  }

  ngOnDestroy(): void {
    this.triggerSub?.unsubscribe();
    this.table?.destroy();
  }

  private render() {
    this.table?.destroy();
    this.table = new DataTable(this.el.nativeElement, this.dtOptions());
  }
}
