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
} from '@angular/forms';
import { Loader } from 'src/app/app.models';
import { User } from 'src/app/models/User.model';
import { CompaniesService } from 'src/app/services/companies.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnChanges {
  @Input() selectedUser: any;
  @Output() onSaveSelectedUser: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDeletedUser: EventEmitter<any> = new EventEmitter<any>();
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
  timezones!: any;

  constructor(
    private userService: UsersService,
    private fb: FormBuilder,
    private companiesService: CompaniesService,
    private dialog: MatDialog
  ) {
    this.userForm = this.fb.group({
      name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      email: [null, [Validators.required]],
      role: [0, [Validators.required]],
      password: [null],
      cpassword: ['xd'],
      company: this.fb.group({
        id: [''],
        timezone: new FormControl(null) // Mover el control timezone aquí dentro del control company
      }),
      employee: this.fb.group({
        'jobPosition': [null, [Validators.required]],
        'hourlyRate': [null, [Validators.required]]
      })
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
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
    // this.getTimezones()
    this.userForm
      .get('email')!
      .valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((email) => {
        console.log('valuechanges');
        const userId = this.selectedUser ? this.selectedUser.id : -1;
        this.userService.verifyUsername(email, userId).subscribe({
          next: (v: any) => {
            console.log(v);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
      });

    this.handleRole();

    this.userService.fetchTimezonesApi().subscribe((data: any) => {
      if (data.status === 'OK' && Array.isArray(data.zones)) {
        this.timezones = data.zones.filter(
          (zone:any) =>
            zone.countryName === 'United States' || zone.countryName === 'USA'
        );
        console.log(this.timezones)
      } else {
        console.error('Error: Invalid data structure');
      }
    });
  }
  resetForm() {
    this.userForm.reset({ password: '', cpassword: '' });
  }

  handleRole() {
    this.userForm.get('role')!.valueChanges.subscribe((role: string) => {
      const companyGroup = this.userForm.get('company') as FormGroup;
      const employeeGroup = this.userForm.get('employee') as FormGroup;
      companyGroup.addControl('timezone', new FormControl(null));
      companyGroup.reset();
      employeeGroup.reset();
      if (role == this.EMPLOYEE_ROLE) {
        for (let controlName in companyGroup.controls) {
          companyGroup.removeControl(controlName);
        }
        if (!employeeGroup.get('jobPosition')) {
          employeeGroup.addControl('jobPosition', this.fb.control(null, Validators.required));
        }
        if (!employeeGroup.get('hourlyRate')) {
          employeeGroup.addControl('hourlyRate', this.fb.control(null, Validators.required));
        }
        employeeGroup.addControl('id', this.fb.control(''));
      } else if (role == this.EMPLOYER_ROLE) {
        for (let controlId in employeeGroup.controls) {
          employeeGroup.removeControl(controlId);
        }
        employeeGroup.removeControl('jobPosition');
        employeeGroup.removeControl('hourlyRate');
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
  public getTimezones() {
    this.userService.fetchTimezonesApi().subscribe({
      next(value) {
        console.log(value);
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

  public deleteUser(id: string) {
    const dialog = this.dialog.open(ModalComponent);
    dialog.afterClosed().subscribe((value: any) => {
      if (value) {
        this.userService.delete(id).subscribe({
          next: (value) => {
            console.log(value);
            this.onDeletedUser.emit(id);
          },
        });
      }
    });
  }
}
