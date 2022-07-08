import { Role } from './../_models/role';
import { Component, OnInit } from '@angular/core';
import { JWTTokenHelper } from '../_helpers/JWTTokenHelper';
import { User } from '../_models/user';
import { TokenStorageService } from '../_services/token-storage.service';
import { AuthenticationService } from './../_services/authentication.service';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { SpringbootservicesService } from '../springbootservices.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: any = {};
//  isLoggedIn = false;
 // isAdmin = false;
  isLoginFailed = false;
  errorMessage = '';
 // role ='';
  userdata: User;
  constructor(private authService: AuthenticationService,private jwhelper: JWTTokenHelper, private tokenStorage: TokenStorageService,private route: ActivatedRoute, private routes: Router,private backendServices : SpringbootservicesService) { }
  ngOnInit():void {
    this.backendServices.navbarcollapse.next(false);
    const token: string = this.route.snapshot.queryParamMap.get('token');
    const error: string = this.route.snapshot.queryParamMap.get('error');
    if(token){
      console.log(token);
      this.tokenStorage.saveToken(token);
      this.tokenStorage.saveUser(this.jwhelper.DecodeToken(token));
    //  this.authService.subscribe();
     this.routerNavigate();
   }
   else if(error){
      this.errorMessage = error;
      this.isLoginFailed = true;
   }
  }
  onSubmit() {
    let returnUrl=this.route.snapshot.queryParamMap.get('returnUrl')||'/';
    localStorage.setItem('returnUrl',returnUrl);
    this.authService.login(this.form).subscribe(
      data => {
        if (data) {
         const token =data.accessToken;
        this.tokenStorage.saveToken(token);
        this.tokenStorage.saveUser(this.jwhelper.DecodeToken(token));
          }

      this.routerNavigate();
      },
      err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    );
  }
  routerNavigate() {
    console.log("Navigating to home or desired page");
    let returnUrl=localStorage.getItem('returnUrl');
    localStorage.removeItem('returnUrl');
    this.routes.navigateByUrl(returnUrl)
     .then(()=>{
      window.location.reload();
     });
  }

  loginWithGoogle(){
    let returnUrl=this.route.snapshot.queryParamMap.get('returnUrl')||'/';
    localStorage.setItem('returnUrl',returnUrl);
    window.location.href= `${environment.apiUrl}oauth2/authorize/google?redirect_uri=${environment.returnUrl}`;
  }

}
