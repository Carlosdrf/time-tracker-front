import { Component, OnInit } from '@angular/core';
import { Roles } from 'src/app/models/Roles';
import { DashboardService } from 'src/app/services/dashboard.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Loader } from 'src/app/app.models';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  constructor(private userService: DashboardService, private fb: FormBuilder) {}
  loader: Loader = new Loader(false,false,false)
  roleList!: Roles[];
  title: string = 'New User';
  formFields!: FormGroup;
  ngOnInit(): void {
    // console.log(this.loader.started)
    this.getRoles();
    this.formFields = this.fb.group({
      name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      email: [null, [Validators.required]],
      role: ['Select a role', [Validators.required]],
    });
  }
  public getRoles() {
    this.userService.getRoles().subscribe({
      next: (x: any) => {
        this.roleList = x;
      },
    });
  }
  public submitUserForm() {
    this.loader = new Loader(true, true, false)
    if (this.formFields.valid) {

      let name = this.formFields.value.name;
      let last_name = this.formFields.value.last_name;
      let email = this.formFields.value.email;
      let role = this.formFields.value.role;
      let newUser = {
        name,
        last_name,
        email,
        role,
      };
      this.userService.createUser(newUser).subscribe({
        next: (res) => {
          console.log(res);
          this.loader = new Loader(false, true, true)
          this.resetLoader()
        },
      });
    } else {
      this.loader = new Loader(false, true, false)
      this.resetLoader()
      console.log('all fields must be filled');
    }
  }
  public resetLoader(){
    setTimeout(() => {
      this.loader = new Loader(false, false, false)
    }, 3000);
  }
}
