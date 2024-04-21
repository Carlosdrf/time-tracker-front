import { Component, OnInit } from '@angular/core';
import { CustomDatePipe } from '../../../services/custom-date.pipe';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserListComponent } from 'src/app/components/user-list/user-list.component';
import { SharedModule } from 'src/app/components/shared.module';
import { TimerComponent } from 'src/app/components/timer/timer.component';
import { SearchComponent } from 'src/app/components/search/search.component';
import { UsersService } from 'src/app/services/users.service';
import { userRoles } from 'src/app/app.models';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-admin-notifications.',
  standalone: true,
  // imports: [UserListComponent, SharedModule, TimerComponent, SearchComponent,],
  // standalone: true,
  imports: [UserListComponent, SharedModule, MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, MatInputModule, MatDatepickerModule, MatNativeDateModule, MatDatepickerModule],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-US' }],
  templateUrl: './admin.notifications.component.html',
  styleUrls: ['./admin.notifications.component.scss'],
})
export class AdminNotificationsComponent implements OnInit {
  notificationForm!: FormGroup;
  panelColor = new FormControl('red');
  selectedUsers = new FormControl();
  public isSlideIn: boolean = false;
  public isCreateLater: boolean = false;
  notification = {
    message: '',
    selectedUsers: '',
    date: null,
    time: null
  }

  constructor(
    private userService: UsersService,
    private fb: FormBuilder
  ) {
    this.notificationForm = this.fb.group({
      message: ['', [Validators.required]],
      selectedUsers: [''],
      date: [null],
      time: [null]
    });
  }

  users = new FormControl('');
  usersList: any[] = [];

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers() {
    let body = {};
    this.userService.getUsers(body).subscribe({
      next: (users) => {
        this.usersList = users.filter((user:any)=> user.active == 1);
        this.usersList = this.usersList.filter(
          (user: any) => user.role === 2 && user.active == 1
        );
      },
      error: (err) => {},
    });
  }

  userToggle() {
    this.isSlideIn = !this.isSlideIn;
  }

  toggleCreateLater() {
    this.isCreateLater = !this.isCreateLater;
  }

  submitNotificationForm() {
    console.log('click')
    this.notification = {
      message: this.notificationForm.value.message,
      selectedUsers: this.notificationForm.value.selectedUsers,
      date: this.notificationForm.value.date,
      time: this.notificationForm.value.time
    }

    console.log(this.notification)
  }
}
 
 