import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { SharedModule } from 'src/app/components/shared.module';
import { UsersService } from 'src/app/services/users.service';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MAT_DATE_LOCALE} from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NotificationsService } from 'src/app/services/notifications.service';
import { PagesComponent } from '../../pages.component';
import { forkJoin } from 'rxjs';
import { EntriesService } from 'src/app/services/entries.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin-notifications.',
  standalone: true,
  imports: [SharedModule, MatFormFieldModule, MatSelectModule, MatCheckboxModule],
  providers: [{ provide: MAT_DATE_LOCALE, useValue: 'en-US' }],
  templateUrl: './admin.notifications.component.html',
  styleUrls: ['./admin.notifications.component.scss'],
})
export class AdminNotificationsComponent implements OnInit {
  @ViewChild('clientCheckbox', { static: false }) checkboxRef!: ElementRef<HTMLInputElement>;
  reviewEntries: any = [];
  entries: any;
  user: any = { id: null, name: null};
  usersIds: any;
  datesRange: any = { firstSelect: '', lastSelect: '' };
  calendarHead: any;
  message: string = '';
  notificationForm!: FormGroup;
  panelColor = new FormControl('red');
  selectedOptions = new FormControl();
  selectedUsers: any[] = [];
  users: any[] = [];
  firefox: boolean = false;
  public isSlideIn: boolean = false;
  public isCreateLater: boolean = false;
  selectedForm: any;
  selectAll: boolean = false;

  public options: any = [
    {
      title: 'Your Notifications',
      active: true,
      elements: [],
      method: null
    },
    {
      title: 'Notifications',
      active: false,
      elements: [],
      method: this.notificationService,
    },
  ];

  constructor(
    private userService: UsersService,
    private notificationService : NotificationsService,
    public entriesService: EntriesService,
    private page: PagesComponent,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.notificationForm = this.fb.group({
      message: ['', [Validators.required]],
      selectedUsers: [''],
    });
  }
  usersList: any[] = [];

  ngOnInit(): void {
    this.getUsers();
    this.getOptionsInfo()
  }

  getUsers() {
    let body = {};
    this.userService.getUsers(body).subscribe({
      next: (users) => {
        this.usersList = users.filter((user:any)=> user.active == 1);
        this.reviewEntries = users.filter((user:any)=> user.review);
        this.usersList = this.usersList.filter(
          (user: any) => (user.role === 2 || user.role === 3) && user.active == 1
        );
        this.usersIds = users.map((user: any) => user.id);
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

  handleSelection(
    i: number,
    selectedOption: any = null,
    selection: any = null
  ) {
    if (selectedOption && !selectedOption.active) {
      this.resetForm();
    }
    this.options.forEach((option: any, index: number) => {
      option.elements.forEach((element: any) => {
        if (selection == element) {
        }
      });

      if (index != i) {
        option.active = false;
      } else {
        option.active = true;
      }
    });

  }

  handleFilter(target: any, option: any) {
    this.resetForm()
    this.notificationService.get().subscribe({
      next: (notifications: any[]) => {
        option.elements = target.value == '-1' ? notifications : notifications.filter(
          (project: any[]) => notifications == target.value
        );
      },
    });
  }

  submit() {
    const formValue = this.notificationForm.value
    const selectedEmployees = this.selectedUsers.filter((user:any) => user.checked);
    const deselectedEmployees = this.selectedUsers.filter((user:any) => !user.checked);
    formValue.selectedUsers = selectedEmployees.map((user:any) => ({
      user_id: user.user_id,
      checked: true
    })).concat(deselectedEmployees.map((user:any) => ({
      user_id: user.user_id,
      checked: false
    })));
    
    if (formValue && formValue.message != '') {
      this.notificationService.submit(formValue,
        this.selectedForm ? this.selectedForm.id : null
      )
        .subscribe({
          next: (response: any) => {
              this.page.setAlert("Notification Created Successfully");
              this.resetForm();
              return; 
          },
          error: (err: ErrorEvent) => {
            const { error } = err;
            this.page.setAlert(error.message);
          },
        });
    }else{
      this.page.setAlert("Fill the required fields")
    }
    this.getOptionsInfo()
  }

  resetForm(open: boolean = false) {
    this.selectedForm = null;
    this.selectedOptions.reset();
    this.notificationForm.reset()
    const selectAllCheckbox = document.getElementById('selectAllCheckbox') as HTMLInputElement;
    selectAllCheckbox.checked = false;
  }

  toggleSelectAll(): void {
    if (this.selectAll) {
      this.selectAll = false;
      this.selectedOptions.reset(); 
      this.selectedUsers = this.usersList.map((item: any) => ({
        user_id: item.id,
        checked: false 
      }));
    } else {
      this.selectAll = true;
      const allUserIds = this.usersList.map((user: any) => user.id);
      this.selectedOptions.setValue(allUserIds);
      this.selectedUsers = this.usersList.map((item: any) => ({
        user_id: item.id,
        checked: true
      }));
    }
  }

  onUsersSelectionChange(selectedUsersIds: number[]): void {
      this.selectedUsers = this.usersList.map((item: any) => ({
        user_id: item.id,
        checked: selectedUsersIds.includes(item.id)
      }));
  }

  getOptionsInfo() {
    forkJoin([
      this.notificationService.get(),
      this.notificationService.get(),
    ]).subscribe({
      next: (selectsInfo) => {
        this.options.forEach((option: any, i: number) => {
          if (i === 0) {
            option.elements = this.reviewEntries.map((user: any) => {
              return { message: `Entries For Review: ${user.name} ${user.last_name}`, id: user.id, name: user.name };
            });
          } else {
            option.elements = selectsInfo[i];
          }
        });
      },
    });
  }

  setReportInfo(user: any) {
    this.userService.setUserInformation(user);
  }
}