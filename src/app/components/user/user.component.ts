import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Roles } from 'src/app/models/Roles';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Loader } from 'src/app/app.models';
import { timeThursday } from 'd3';
import { User } from 'src/app/models/User.model';
import { ActivatedRoute } from '@angular/router';
import { CompaniesService } from 'src/app/services/companies.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnChanges {
  @Input() selectedUser: any;
  newUser: User = {
    name: '',
    last_name: '',
    email: '',
    password: '',
    role: 0,
    company: {},
  };
  loader: Loader = new Loader(false, false, false);
  roleList!: Roles[];
  title: string = 'New User';
  userForm!: FormGroup;
  message: string | null = null;
  companies: any;
  ADMIN_ROLE = '1';
  EMPLOYEE_ROLE = '2';
  EMPLOYER_ROLE = '3';

  constructor(
    private userService: UsersService,
    private fb: FormBuilder,
    private companiesService: CompaniesService,
    private route: ActivatedRoute
  ) {
    this.userForm = this.fb.group({
      name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      email: [null, [Validators.required]],
      role: ['Select a role', [Validators.required]],
      password: [null, Validators.required],
      cpassword: [null, Validators.required],
      company: this.fb.group({}),
    });

    this.userForm.get('role')!.valueChanges.subscribe((role) => {
      console.log('role ha cambiado: ' + role);
      const companyGroup = this.userForm.get('company') as FormGroup;
      for (let controlName in companyGroup.controls) {
        console.log('se ha removido: ' + controlName);
        companyGroup.removeControl(controlName);
      }
      if (role === this.EMPLOYEE_ROLE) {
        companyGroup.addControl(
          'id',
          this.fb.control('Select a company', Validators.required)
        );
      } else if (role === this.EMPLOYER_ROLE) {
        companyGroup.addControl('name', this.fb.control(null));
        companyGroup.addControl('description', this.fb.control(null));
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedUser']) {
      console.log(changes);
      this.userForm.patchValue(this.selectedUser);
      if (this.selectedUser) {
        this.title = 'Edit user';
      }
    }
  }
  ngOnInit(): void {
    this.getRoles();
    this.getCompanies();
    this.route.params.subscribe((params) => {
      console.log(params['id']);
    });
    this.userForm.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => {
        console.log(value.email);
        this.userService.verifyUsername(value.email, this.selectedUser.id).subscribe({
          next: (v: any) => {
            console.log(v)
          }, 
          error: (err: any)=>{
            console.error(err)
          }
        })
      });
  }
  public getRoles() {
    this.userService.getRoles().subscribe({
      next: (x: any) => {
        this.roleList = x;
      },
    });
  }
  public getCompanies() {
    this.companiesService.getCompanies().subscribe({
      next: (v) => {
        this.companies = v;
      },
    });
  }
  public submitUserForm() {
    this.loader = new Loader(true, true, false);
    if (
      this.userForm.valid &&
      this.userForm.value.role !== 'Select a role' &&
      this.userForm.value.company.id !== 'Select a company'
    ) {
      if (this.userForm.value.password === this.userForm.value.cpassword) {
        this.message = '';
        this.newUser.name = this.userForm.value.name;
        this.newUser.last_name = this.userForm.value.last_name;
        this.newUser.email = this.userForm.value.email;
        this.newUser.role = this.userForm.value.role;
        this.newUser.password = this.userForm.value.password;

        if (this.userForm.value.role != this.ADMIN_ROLE) {
          if (this.userForm.value.company.id != null) {
            this.newUser.company.id = this.userForm.value.company.id;
          } else {
            this.newUser.company.name = this.userForm.value.company.name;
            if (this.userForm.value.company.description != null) {
              this.newUser.company.description =
                this.userForm.value.company.description;
            }
          }
        }
        console.log(this.newUser);
        this.userService.createUser(this.newUser).subscribe({
          next: () => {
            this.loader = new Loader(false, true, true);
            this.resetLoader();
          },
          error: (err) => {
            this.loader = new Loader(false, true, false);
            this.message = err.error.message;
            this.resetLoader();
          },
        });
      } else {
        this.loader = new Loader(false, true, false);
        this.resetLoader();
        this.message = 'Confirm password error';
      }
    } else {
      this.loader = new Loader(false, true, false);
      this.resetLoader();
      this.message = 'All fields must be filled';
    }
  }
  public resetLoader() {
    setTimeout(() => {
      this.loader = new Loader(false, false, false);
      this.message = '';
    }, 3000);
  }

  public verifyUserName() {
    
  }
}
