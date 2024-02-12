import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SearchComponent } from 'src/app/components/search/search.component';
import { SharedModule } from 'src/app/components/shared.module';
import { UserListComponent } from 'src/app/components/user-list/user-list.component';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-admin.users',
  standalone: true,
  imports: [SearchComponent, UserListComponent, SharedModule],
  templateUrl: './admin.users.component.html',
  styleUrl: './admin.users.component.scss',
})
export class AdminUsersComponent {
  @ViewChild('appUser', { static: true }) appUser!: ElementRef;
  public loaded: boolean = false;
  public searchForm: FormGroup = new FormGroup({
    searchField: new FormControl(''),
  });
  public users: any;
  public links: any = '';
  public isSlideIn: boolean = false;
  public selectedUser: any;
  constructor(private userService: UsersService) {}

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
      // this.appUser.nativeElement.classList.remove('visually-hidden');
      return;
    }
    // this.appUser.nativeElement.classList.toggle('visually-hidden');
    this.isSlideIn = !this.isSlideIn;
  }
  setSelectedUser(user: any) {
    this.selectedUser = user;
    if (this.appUser.nativeElement.classList.contains('visually-hidden')) {
      // this.appUser.nativeElement.classList.remove('visually-hidden');
    }
    if (!this.isSlideIn) this.isSlideIn = true;
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
}
