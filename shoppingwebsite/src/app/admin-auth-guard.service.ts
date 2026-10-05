import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenStorageService } from './_services/token-storage.service';

export const adminAuthGuard: CanActivateFn = () => {
  const tokenStorage = inject(TokenStorageService);
  if (tokenStorage.getToken() && tokenStorage.isAdmin()) {
    console.log("Admin auth guard true");
    return true;
  }
  return inject(Router).createUrlTree(['/']);
};
