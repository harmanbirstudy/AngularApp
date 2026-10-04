import { Routes } from '@angular/router';
import { ProductsComponent } from './products/products.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { BillingPaymentComponent } from './billing-payment/billing-payment.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { OrderSuccessComponent } from './order-success/order-success.component';
import { MyOrdersComponent } from './my-orders/my-orders.component';
import { ProductFormComponent } from './admin/product-form/product-form.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { AdminOrdersComponent } from './admin/admin-orders/admin-orders.component';
import { authGuard } from './auth-guard.service';
import { adminAuthGuard } from './admin-auth-guard.service';

export const routes: Routes = [
  {path: '',component: ProductsComponent},
  {path: 'products',component: ProductsComponent},
  {path: 'shopping-cart',component: ShoppingCartComponent},
  {path: 'login',component: LoginComponent},
  {path: 'signup',component: SignupComponent},
  {path: 'billing-payment',component: BillingPaymentComponent},

  {path: 'check-out',component: CheckOutComponent,canActivate:[authGuard]},
  {path: 'order-success/:orderid',component: OrderSuccessComponent,canActivate:[authGuard]},
  {path: 'my-orders',component: MyOrdersComponent,canActivate:[authGuard]},

  {path: 'admin/products/new',component: ProductFormComponent,canActivate:[authGuard,adminAuthGuard]},
  {path: 'admin/products/:productid',component: ProductFormComponent,canActivate:[authGuard,adminAuthGuard]},
  {path: 'admin/products',component: AdminProductsComponent,canActivate:[authGuard,adminAuthGuard]},
  {path: 'admin/orders',component: AdminOrdersComponent,canActivate:[authGuard,adminAuthGuard]}
];
