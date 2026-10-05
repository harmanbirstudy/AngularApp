import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { TokenStorageService } from '../_services/token-storage.service';
const TOKEN_HEADER_KEY = 'Authorization';

// add auth header with jwt if user is logged in and request is to api url
export const jwtInterceptor: HttpInterceptorFn = (request, next) => {
  let authReq = request;
  const token = inject(TokenStorageService).getToken();
  const isApiUrl = request.url.startsWith(environment.apiUrl);
  if (token != null && isApiUrl) {
    authReq = request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
  }
  return next(authReq);
};
