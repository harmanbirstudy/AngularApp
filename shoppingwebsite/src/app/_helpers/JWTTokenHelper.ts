import { User } from '../_models/user';
import { Injectable, NgModule } from '@angular/core';
//import  jwt_decode from "jwt-decode";
//import jwt_decode, { JwtPayload } from 'jwt-decode'
import jwtDecode, { JwtPayload } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class JWTTokenHelper{
  constructor(){}

  DecodeToken(token: any): User {
    console.log(token);
    try {
      //const data = decode(token);
   // var decodedtoken= jwt_decode(token);
  // console.log(token);
    const decodedtoken = jwtDecode(token);
    console.log(decodedtoken);
    const user : User ={
      id: decodedtoken['sub'],
      name: decodedtoken['NAME'],
      imageurl: decodedtoken['IMAGEURL'],
      role: decodedtoken['ROLE'],
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
