import { User } from '../_models/user';
import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from "jwt-decode";

interface AppJwtPayload extends JwtPayload {
  NAME?: string;
  IMAGEURL?: string;
  ROLE?: any;
}

@Injectable({
  providedIn: 'root'
})
export class JWTTokenHelper{
  constructor(){}

  DecodeToken(token: any): User {
    console.log(token);
    try {
    const decodedtoken = jwtDecode<AppJwtPayload>(token);
    console.log(decodedtoken);
    const user : User ={
      id: decodedtoken.sub,
      name: decodedtoken.NAME,
      imageurl: decodedtoken.IMAGEURL,
      role: decodedtoken.ROLE,
     // token: token
    }
    console.log(user);
      return user;
      // valid token format
    } catch(error) {
      console.log(error);
    }

    return null;
    }



}
