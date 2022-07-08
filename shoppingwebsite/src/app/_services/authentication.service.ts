import { JWTTokenHelper } from './../_helpers/JWTTokenHelper';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { TokenStorageService } from '../_services/token-storage.service';
import { User } from '../_models/user';
import { SignUpUser } from '../_models/signupuser';
import { Router } from '@angular/router';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class AuthenticationService {
    // private currentUserSubject: BehaviorSubject<User>;
    // public currentUser: Observable<User>;


    constructor(private http: HttpClient,private jwhelper: JWTTokenHelper,private tokenStorage: TokenStorageService,private routes: Router) {

    }

    // subscribe(){
    //   if (this.tokenStorage.getToken()){
    //     this.currentUserSubject = new BehaviorSubject<User>(this.tokenStorage.getUser());
    //     this.currentUser = this.currentUserSubject.asObservable();
    //     console.log(this.currentUser);
    //   }

    // }

    login(credentials: { email: any; password: any; }) : Observable<any>  {
      return this.http.post<any>(`${environment.apiUrl}auth/login`, {
        email: credentials.email,
        password: credentials.password
      }, httpOptions)
  }

    signup(user: { username: String; email: String; password: String; matchingPassword: String; }) : Observable<any> {
      return this.http.post(`${environment.apiUrl}auth/signup`, {
        username: user.username,
        email: user.email,
        password: user.password,
        matchingPassword: user.matchingPassword
       }, httpOptions);
    }

     logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('returnUrl');
        this.tokenStorage.signOut();
      // this.currentUserSubject.next(null);
    //  this.routes.navigateByUrl("/");
    this.routes.navigateByUrl("/")
    .then(()=>{
     window.location.reload();
    });
        //window.location.reload();
    }
}
