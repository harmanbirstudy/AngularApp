import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BsNavbarComponent } from './bs-navbar/bs-navbar.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BsNavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'shoppingwebsite';
}
