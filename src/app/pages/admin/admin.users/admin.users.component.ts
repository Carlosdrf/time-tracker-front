import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  SearchComponent,
  SearchForm,
} from 'src/app/components/search/search.component';
import { SharedModule } from 'src/app/components/shared.module';
import { UserFormComponent } from 'src/app/components/user-form/user-form.component';
import {
  Link,
  UserListComponent,
} from 'src/app/components/user-list/user-list.component';
import { UsersService } from 'src/app/services/users.service';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-admin.users',
  standalone: true,
  imports: [
    SearchComponent,
    UserListComponent,
    UserFormComponent,
    SharedModule,
    MatSlideToggleModule,
  ],
  templateUrl: './admin.users.component.html',
  styleUrl: './admin.users.component.scss',
})
export class AdminUsersComponent {
  @ViewChild('appUser', { static: true }) appUser!: ElementRef;
  private fb = inject(FormBuilder);
  private userService = inject(UsersService);
  public loaded: boolean = false;
  public searchForm: FormGroup;
  public users: any;
  public links: Link[] = [];
  public isSlideIn: boolean = false;
  public selectedUser: any;
  showDisable: boolean = true;

  constructor() {
    this.searchForm = this.fb.group({
      searchField: [''],
      filter: this.fb.group({
        role: [null],
        status: [true],
      }),
    });
  }

  get filterForm() {
    return this.searchForm.get('filter') as FormGroup;
  }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers(this.searchForm.value).subscribe((users) => {
      this.users = users;
      this.loaded = true;
    });
  }

  loading() {
    this.users = [];
    this.loaded = false;
  }

  userToggle() {
    if (this.selectedUser) {
      this.selectedUser = null;
      return;
    }
    this.isSlideIn = !this.isSlideIn;
  }
  setSelectedUser(user: any) {
    if (this.selectedUser && this.selectedUser.id === user.id) {
      this.isSlideIn = !this.isSlideIn;
    } else {
      this.isSlideIn = true;
      this.selectedUser = user;
    }
  }

  handleSavedUser(user: any) {
    const userIds = this.users.map((user: any) => user.id);
    if (userIds.includes(user.id)) {
      this.users.forEach((oldUser: any, i: number) => {
        if (oldUser.id == user.id) {
          this.users[i] = user;
        }
      });
    } else {
      this.users = [user, ...this.users];
    }
    this.selectedUser = user;
  }
  handleDeletedUser(user_id: string) {
    this.users = this.users.filter((user: any) => user.id !== user_id);
    this.selectedUser = null;
  }
  toggleUserStatus(user: any) {
    user.active = !user.active;
    this.userService.update(user).subscribe({
      next: (value: any) => {
        if (!user.active) {
          this.users = this.users.filter((user: any) => user.id !== value.id);
        }
      },
    });
  }
  isMobile() {
    if (window.innerWidth <= 576) {
      return true;
    }
    return false;
  }
  closeFormMobile(show: any) {
    this.isSlideIn = show;
    this.selectedUser = null;
  }

  loadUsersByType() {
    this.loaded = false;
    this.filterForm.get('status')?.setValue(this.showDisable);
    this.getUsers();
  }
}
