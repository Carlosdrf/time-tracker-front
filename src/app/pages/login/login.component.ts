import { Component, HostBinding } from '@angular/core';
import { AuthService } from "../../services/auth.service";
import { Login, SignUp } from "../../models/Auth";
import { ActivatedRoute, Router } from "@angular/router";
import { WebSocketService } from 'src/app/services/socket/web-socket.service';

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
  message: any
  passerror: boolean = false
  emailerror: boolean = false
  constructor(private socketService: WebSocketService, private authService: AuthService, private router: Router, private route: ActivatedRoute){}
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
    if(this.login.email == '' && this.login.password == ''){
      this.passerror = true
      this.message = "Fields can't be empty"
      this.authError()
    }else{
      this.authService.login(this.login.email, this.login.password).subscribe({
        next: (v) => {
          const jwt = v.token;
          const name = v.username;
          const role = v.role_id
          const email = v.email
          console.log(role)
          this.socketService.socket.emit('client:joinRoom', email)
          localStorage.setItem('role', role)
          localStorage.setItem('name', name)
          localStorage.setItem('jwt', jwt);
          localStorage.setItem('email', email);
          this.authService.userTypeRouting(role)
        },
        error: (err)=>{
          if(err.status === 401){
            this.passerror = true
            this.message = 'Incorrect Pasword'
            this.authError();
          }else if(err.status === 400){
            this.emailerror = true
            this.message = "Wrong email"
            this.authError()
          }
        }
      })
    }
  }
  authError(){
    setTimeout(() => {
      this.emailerror = false
      this.message = null
      this.passerror = false
    }, 3000);
  }
  authSignup(){
    if(this.signUp.password === this.signUp.confirmPass && this.signUp.password.length > 7){
      this.authService.signup(this.signUp).subscribe(
        (v) => {
          const jwt = v.token;
          const name = v.username;
          const role = v.role_id;
          const email = v.email
          this.socketService.socket.emit('client:joinRoom', email)

          localStorage.setItem('role', role)
          localStorage.setItem('name', name)
          // localStorage.setItem('email', email);
          localStorage.setItem('jwt', jwt);
          this.authService.userTypeRouting(role)
        }
      )
    }
  }
}
