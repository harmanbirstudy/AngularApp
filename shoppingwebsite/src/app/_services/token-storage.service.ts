import { User } from './../_models/user';
import { Injectable } from '@angular/core';
import { BOOL_TYPE } from '@angular/compiler/src/output/output_ast';
import { Observable } from 'rxjs';
const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
@Injectable()
export class TokenStorageService {
  constructor() { }
  signOut() {
   // localStorage.clear();
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
  public saveToken(token: string) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.setItem(TOKEN_KEY, token);
  }
  public getToken(): string {
    return localStorage.getItem(TOKEN_KEY);
  }
  public saveUser(user: User) {
    console.log(user);
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(USER_KEY, JSON.stringify({user}));
  }
  public getUser() :User {

    const saveduser = JSON.parse(localStorage.getItem(USER_KEY));

   const user : User ={
    id: saveduser.user.id,
    name: saveduser.user.name,
    imageurl: saveduser.user.imageurl,
    role: saveduser.user.role,

  }
    return user;
  }

  public isAdmin(): boolean{

    if (this.getToken()) {
      let role=this.getUser().role;
      if(role == "[ROLE_ADMIN]"){
        return true;
        console.log(true);
      }
      else return false;
     }
     else return false;
  }


  }

