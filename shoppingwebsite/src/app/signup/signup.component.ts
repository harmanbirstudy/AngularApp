import { AuthenticationService } from './../_services/authentication.service';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SpringbootservicesService } from '../springbootservices.service';

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-signup',
  imports: [FormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  form: any = {};
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  succesMessage='';
  constructor(private authService: AuthenticationService,private backendServices : SpringbootservicesService) { }

  ngOnInit(): void {
    this.backendServices.navbarcollapse.next(false);
  }
  onSubmit() {
    this.authService.signup(this.form).subscribe(
      data => {
        console.log(data);

        this.isSuccessful = true;
        this.isSignUpFailed = false;
        this.succesMessage = data.message;

      },
      err => {
        this.errorMessage = err.error.message;
        this.isSignUpFailed = true;
      }
    );
   }
}
