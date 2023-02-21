import { Component, HostBinding } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Login, SignUp } from "../../models/Auth";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  @HostBinding('class') classes = 'row';
  isSignUp: boolean = false
  login: Login = {
    email: '',
    password: '',
  }
  signUp: SignUp = {
    email: '',
    password: '',
    confirmPass: '',
    name: '',
    last_name:''
  }
  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute){}
  ngOnInit(){
    this.isSignUp = this.route.snapshot.queryParams['isSignUp'] === 'true';
  }
  signIntoUp(){
    this.isSignUp = !this.isSignUp
    const path = this.isSignUp ? 'signup':'login'
    if(path === 'login'){
      this.router.navigate([path])
    }else{
      this.router.navigate([path], {queryParams: {isSignUp: true}})
    }
    
  }
  authLogin(){
    this.authService.login(this.login.email, this.login.password).subscribe(
      (v) => {
        const jwt = v.token;
        const name = v.username;
        localStorage.setItem('name', name)
        localStorage.setItem('jwt', jwt);
        this.router.navigateByUrl('/dashboard')
      }
    )
  }
  authSignup(){
    if(this.signUp.password === this.signUp.confirmPass && this.signUp.password.length > 7){
      this.authService.signup(this.signUp).subscribe(
        (v) => {
          const jwt = v.token;
          const name = v.username;
          localStorage.setItem('name', name)
          localStorage.setItem('jwt', jwt);
          this.router.navigateByUrl('/dashboard')
        }
      )
    }
    // else{
    // }
  }
}