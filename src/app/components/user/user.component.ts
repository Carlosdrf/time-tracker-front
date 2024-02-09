import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Roles } from 'src/app/models/Roles';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  ReactiveFormsModule,
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
  @Output() onSaveSelectedUser: EventEmitter<any> = new EventEmitter<any>();
  newUser: User = {
    id: '',
    name: '',
    last_name: '',
    email: '',
    password: '',
    role: 0,
    company: {},
    employee: {},
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
      role: [0, [Validators.required]],
      password: [null],
      cpassword: ['xd'],
      company: this.fb.group({ id: [''] }),
      employee: this.fb.group({}),
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('password');
    if (changes['selectedUser']) {
      if (!this.selectedUser) {
        this.title = 'New User';
        this.resetForm();
        this.userForm.get('role')?.setValue('');
        this.userForm.get('password')?.setValidators(Validators.required);
        if (this.userForm.get('employee'))
          this.userForm.get('employee')?.get('id')?.setValue('');
        return;
      }

      this.resetForm();
      this.userForm.patchValue(this.selectedUser);
      if (this.selectedUser) {
        this.title = 'Edit User';
        this.userForm.get('password')?.clearValidators();
      }
      if (!this.selectedUser.employee && this.selectedUser.role == 2) {
        this.userForm.get('employee')?.get('id')?.setValue('');
      }
      this.userForm.get('password')?.updateValueAndValidity();
    }
  }

  ngOnInit(): void {
    this.getRoles();
    this.getCompanies();

    this.userForm
      .get('email')!
      .valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((email) => {
        console.log('valuechanges');
        const userId = this.selectedUser ? this.selectedUser.id : -1;
        this.userService.verifyUsername(email, userId).subscribe({
          next: (v: any) => {
            // console.log(v);
          },
          error: (err: any) => {
            // console.error(err);
          },
        });
      });

    this.handleRole();
    console.log(this.userForm);
  }
  resetForm() {
    this.userForm.reset({ password: '', cpassword: '' });
  }

  handleRole() {
    this.userForm.get('role')!.valueChanges.subscribe((role: string) => {
      const companyGroup = this.userForm.get('company') as FormGroup;
      const employeeGroup = this.userForm.get('employee') as FormGroup;
      if (role == this.EMPLOYEE_ROLE) {
        for (let controlName in companyGroup.controls) {
          companyGroup.removeControl(controlName);
        }
        employeeGroup.addControl('id', this.fb.control(''));
      } else if (role == this.EMPLOYER_ROLE) {
        for (let controlId in employeeGroup.controls) {
          employeeGroup.removeControl(controlId);
        }
        companyGroup.addControl('name', this.fb.control(null));
        companyGroup.addControl('description', this.fb.control(null));
      }
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
    if (this.selectedUser) this.newUser.id = this.selectedUser.id;
    else this.newUser.id = '-1';
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

        if (this.userForm.value.role == this.EMPLOYER_ROLE) {
          if (this.userForm.value.company.id != null) {
            this.newUser.company.id = this.userForm.value.company.id;
            this.newUser.company.name = this.userForm.value.company.name;
            if (this.userForm.value.company.description != null) {
              this.newUser.company.description =
                this.userForm.value.company.description;
            }
          }
        }
        if (
          this.userForm.value.employee &&
          this.EMPLOYEE_ROLE == this.userForm.value.role
        ) {
          this.newUser.employee.id = this.userForm.value.employee.id;
        }
        // console.log(this.newUser);
        this.userService.createUser(this.newUser).subscribe({
          next: (user) => {
            this.onSaveSelectedUser.emit(user);
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

  public verifyUserName() {}
}
