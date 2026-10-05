import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenStorageService } from './_services/token-storage.service';

export const authGuard: CanActivateFn = (route, state) => {
  if (inject(TokenStorageService).getToken()) {
    return true;
  }
  return inject(Router).createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
