import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { local } from 'd3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'I-nimble - Work Smart';

  constructor(private userService: AuthService){}

  ngOnInit(){
    const userType = localStorage.getItem('role')
    if(userType){
      this.userService.setUserType(userType)
    }
  }
}