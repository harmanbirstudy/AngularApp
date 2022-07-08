import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TokenStorageService } from './_services/token-storage.service';

@Injectable()
export class AdminAuthGuardService implements CanActivate {

  constructor(private tokenStorage: TokenStorageService,private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    if (this.tokenStorage.getToken()&&this.tokenStorage.isAdmin()) {
      console.log("Admin auth guard true");
      return  true;
     }
     else {
      this.router.navigate(['/']);
      return false;}
  }
}
