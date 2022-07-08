import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { TokenStorageService } from './_services/token-storage.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuardService  implements CanActivate {

  constructor(private tokenStorage: TokenStorageService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    if (this.tokenStorage.getToken()) {
      return true;
     }
     else {
       this.router.navigate(['/login'],{queryParams:{returnUrl:state.url}});
       return false;
     }
  }


}
