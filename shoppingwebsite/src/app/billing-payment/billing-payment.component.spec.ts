import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { BillingPaymentComponent } from './billing-payment.component';

describe('BillingPaymentComponent', () => {
  let component: BillingPaymentComponent;
  let fixture: ComponentFixture<BillingPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingPaymentComponent],
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
