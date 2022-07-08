import { AdminAuthGuardService } from './admin-auth-guard.service';
import { TokenStorageService } from './_services/token-storage.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from './_services/authentication.service';
import { authInterceptorProviders } from './_helpers/JwtInterceptor';
import { RouterModule } from '@angular/router';
import { environment } from './../environments/environment.prod';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BsNavbarComponent } from './bs-navbar/bs-navbar.component';
import { HomeComponent } from './home/home.component';
import { ProductsComponent } from './products/products.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { BillingPaymentComponent } from './billing-payment/billing-payment.component';
import { LoginComponent } from './login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SignupComponent } from './signup/signup.component';
import { FormsModule } from '@angular/forms';
import { AuthGuardService } from './auth-guard.service';
import { ProductFormComponent } from './admin/product-form/product-form.component';
import { SpringbootservicesService } from './springbootservices.service';
import { BrowserModule } from '@angular/platform-browser';
import { DataTablesModule } from 'angular-datatables';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    BsNavbarComponent,
    HomeComponent,
    ProductsComponent,
    ShoppingCartComponent,
    CheckOutComponent,
    OrderSuccessComponent,
    MyOrdersComponent,
    AdminProductsComponent,
    AdminOrdersComponent,
    BillingPaymentComponent,
    LoginComponent,
    SignupComponent,
    ProductFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    DataTablesModule,
    FormsModule,
    RouterModule.forRoot([
      {path: '',component: ProductsComponent},
      {path: 'products',component: ProductsComponent},
      {path: 'shopping-cart',component: ShoppingCartComponent},
      {path: 'login',component: LoginComponent},
      {path: 'signup',component: SignupComponent},
      {path: 'billing-payment',component: BillingPaymentComponent},

      {path: 'check-out',component: CheckOutComponent,canActivate:[AuthGuardService]},
      {path: 'order-success/:orderid',component: OrderSuccessComponent,canActivate:[AuthGuardService]},
      {path: 'my-orders',component: MyOrdersComponent,canActivate:[AuthGuardService]},

      {path: 'admin/products/new',component: ProductFormComponent,canActivate:[AuthGuardService,AdminAuthGuardService]},
      {path: 'admin/products/:productid',component: ProductFormComponent,canActivate:[AuthGuardService,AdminAuthGuardService]},
      {path: 'admin/products',component: AdminProductsComponent,canActivate:[AuthGuardService,AdminAuthGuardService]},
      {path: 'admin/orders',component: AdminOrdersComponent,canActivate:[AuthGuardService,AdminAuthGuardService]}
    ]),
    NgbModule
  ],
  providers: [authInterceptorProviders,
    AuthenticationService,
    TokenStorageService,
    AuthGuardService,
    AdminAuthGuardService,
    SpringbootservicesService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
