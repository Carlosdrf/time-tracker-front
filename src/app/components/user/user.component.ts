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
  FormArray,
} from '@angular/forms';
import { Loader } from 'src/app/app.models';
import { User } from 'src/app/models/User.model';
import { CompaniesService } from 'src/app/services/companies.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { PositionsService } from 'src/app/services/positions.service';
import { Positions } from 'src/app/models/Position.model';
import * as moment from 'moment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnChanges {
  @Input() selectedUser: any;
  @Output() onSaveSelectedUser: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDeletedUser: EventEmitter<any> = new EventEmitter<any>();
  img: any;
  newUser!: User;
  loader: Loader = new Loader(false, false, false);
  roleList!: Roles[];
  title: string = 'New User';
  userForm!: FormGroup;
  message: string | null = null;
  companies: any;
  positions: Positions[] = [];
  ADMIN_ROLE = '1';
  EMPLOYEE_ROLE = '2';
  EMPLOYER_ROLE = '3';
  timezones!: any;
  daysOfWeekOptions: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  selectedDaysOfWeek: string[] = [];

  constructor(
    private userService: UsersService,
    private fb: FormBuilder,
    private companiesService: CompaniesService,
    private positionsService: PositionsService,
    private dialog: MatDialog
  ) {
    this.userForm = this.fb.group({
      profile: [''],
      name: [null, [Validators.required]],
      last_name: [null, [Validators.required]],
      email: [null, [Validators.required]],
      role: ['', [Validators.required]],
      password: [null],
      cpassword: [''],
      company: this.fb.group({
        id: [''],
        name: [null, [Validators.required]],
        timezone: [''],
      }),
      employee: this.fb.group({
        id: [''],
        position: [''],
        hourlyRate: [null, [Validators.required]],
        // daysOfWeek: this.fb.array([]),
        // startTime: [null, [Validators.required]],
        // endTime: [null, [Validators.required]],
      }),
    });
    // const daysOfWeekFormArray = this.userForm.get(
    //   'employee.daysOfWeek'
    // ) as FormArray;
    // this.daysOfWeekOptions.forEach(() => {
    //   daysOfWeekFormArray.push(new FormControl(false));
    // });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedUser']) {
      if (!this.selectedUser) {
        this.title = 'New User';
        this.resetForm();
        this.userForm.get('role')?.setValue('');
        return;
      }

      this.resetForm();
      this.userForm.reset();
      this.userForm.patchValue(this.selectedUser);
      if (this.selectedUser) {
        this.title = 'Edit User';
        this.userForm.get('password')?.clearValidators();
      }
      if (!this.selectedUser.employee && this.selectedUser.role == 2) {
        this.userForm.get('employee')?.get('id')?.setValue('');
      }
      this.userForm.get('password')?.updateValueAndValidity();
      for (let propName in this.selectedUser) {
        if (propName == 'employee') {
          for (let employeeKey in this.selectedUser[propName]) {
            if (this.selectedUser[propName][employeeKey] == null) {
              console.log('set', employeeKey);
              this.userForm.get(propName)?.get(employeeKey)?.setValue('');
            }
          }
        }
      }
      this.newUser = this.selectedUser
      if (this.userForm.get('company.timezone')?.value == null) {
        this.userForm.get('company.timezone')?.setValue('');
      }
    }
  }

  ngOnInit(): void {
    this.getRoles();
    this.getCompanies();
    this.getPositions();
    this.userForm
      .get('email')!
      .valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((email) => {
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
        this.timezones = data.zones.map((timezone: any) => {
          timezone.fechaActual = this.convertTimezone(timezone);
          return timezone;
        });
      } else {
        console.error('Error: Invalid data structure');
      }
    });
  }

  convertTimezone(timezone: any) {
    const { countryName, timestamp, gmtOffset, zoneName, countryCode } =
      timezone;
    const fechaHoraActual = new Date().toLocaleString(countryCode, {
      timeZone: zoneName,
    });

    return fechaHoraActual;
  }
  resetForm() {
    this.userForm.reset({ password: '', cpassword: '' });
  }

  handleRole() {
    this.userForm.get('role')!.valueChanges.subscribe((role: string) => {
      const companyGroup = this.userForm.get('company') as FormGroup;
      const employeeGroup = this.userForm.get('employee') as FormGroup;
      companyGroup.reset();
      employeeGroup.reset();
      if (role == this.ADMIN_ROLE) {
        for (let controlName in companyGroup.controls) {
          companyGroup.removeControl(controlName);
        }
        for (let controlId in employeeGroup.controls) {
          employeeGroup.removeControl(controlId);
        }
      }
      if (role == this.EMPLOYEE_ROLE) {
        for (let controlName in companyGroup.controls) {
          companyGroup.removeControl(controlName);
        }

        if (!employeeGroup.get('position')) {
          employeeGroup.addControl(
            'position',
            this.fb.control('', Validators.required)
          );
        }
        if (!employeeGroup.get('hourlyRate')) {
          employeeGroup.addControl(
            'hourlyRate',
            this.fb.control(null, Validators.required)
          );
        }
        if (!employeeGroup.get('daysOfWeek')) {
          employeeGroup.addControl('daysOfWeek', this.fb.array([]));
        }
        this.addDaysOfWeekOptions();
        if (!employeeGroup.get('startTime')) {
          employeeGroup.addControl(
            'startTime',
            this.fb.control(null, Validators.required)
          );
        }
        if (!employeeGroup.get('endTime')) {
          employeeGroup.addControl(
            'endTime',
            this.fb.control(null, Validators.required)
          );
        }
        employeeGroup.addControl('id', this.fb.control(''));
        if (!this.selectedUser) {
          this.userForm.get('password')?.setValidators(Validators.required);
          this.userForm.get('employee')?.get('id')?.setValue('');
          this.userForm.get('employee')?.get('position')?.setValue('');
        }
      } else if (role == this.EMPLOYER_ROLE) {
        for (let controlId in employeeGroup.controls) {
          employeeGroup.removeControl(controlId);
          console.log(controlId);
        }
        companyGroup.addControl('id', this.fb.control(''));
        companyGroup.addControl('name', this.fb.control(''));
        companyGroup.addControl('description', this.fb.control(''));
        companyGroup.addControl('timezone', this.fb.control(''));
        if (!this.selectedUser) {
          companyGroup.get('timezone')?.setValue('');
        }
      }
    });
  }
  public addDaysOfWeekOptions() {
    const daysOfWeekArray = this.userForm.get(
      'employee.daysOfWeek'
    ) as FormArray;
    const daysOfWeekOptions = [
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ];

    daysOfWeekOptions.forEach((day) => {
      const control = new FormControl(false);
      daysOfWeekArray.push(control);
    });

    daysOfWeekArray.valueChanges.subscribe((selectedValues) => {
      const selectedDaysOfWeek: string[] = [];
      selectedValues.forEach((value: any, index: any) => {
        if (value) {
          selectedDaysOfWeek.push(daysOfWeekOptions[index]);
        }
      });
      this.selectedDaysOfWeek = selectedDaysOfWeek;
    });
  }
  public getRoles() {
    this.userService.getRoles().subscribe({
      next: (roles: any) => {
        this.roleList = roles;
      },
    });
  }
  public getCompanies() {
    this.companiesService.getCompanies().subscribe({
      next: (companies) => {
        this.companies = companies;
      },
    });
  }
  public getTimezones() {
    this.userService.fetchTimezonesApi().subscribe({
      next: (timezones) => {
        this.timezones = timezones;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  public getPositions() {
    this.positionsService.get().subscribe({
      next: (positions: Positions[]) => {
        this.positions = positions;
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
        this.newUser.profile = this.userForm.value.profile;
        this.newUser.active = this.selectedUser.active
        if (this.userForm.value.role == this.EMPLOYER_ROLE) {
          if (this.userForm.value.company != null) {
            this.newUser.company.id = this.userForm.value.company.id;
            this.newUser.company.name = this.userForm.value.company.name;
            this.newUser.company.timezone =
              this.userForm.value.company.timezone;
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
          this.newUser.employee.position =
            this.userForm.value.employee.position;
          this.newUser.employee.hourlyRate =
            this.userForm.value.employee.hourlyRate;
          this.newUser.employee.daysOfWeek = this.selectedDaysOfWeek;
          this.newUser.employee.startTime =
            this.userForm.value.employee.startTime;
          this.newUser.employee.endTime = this.userForm.value.employee.endTime;
        }
        console.log(this.newUser);
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
    const dialog = this.dialog.open(ModalComponent, {
      data: { subject: 'user' },
    });
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
  onFileSelected(event: any) {
    const img = event.target.files[0];
    if (img) {
      this.previewImage(img);
      this.userForm.patchValue({ profile: img });
    }
  }
  previewImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.img = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}
