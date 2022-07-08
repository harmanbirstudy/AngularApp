import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { AuthenticationService } from "../_services/authentication.service"
import { TokenStorageService } from '../_services/token-storage.service';
const TOKEN_HEADER_KEY = 'Authorization';
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private tokenStorage: TokenStorageService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add auth header with jwt if user is logged in and request is to api url
        let authReq = request;
    const token = this.tokenStorage.getToken();
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (token != null && isApiUrl) {
      authReq = request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
    }

        return next.handle(authReq);
    }
}
export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
];
