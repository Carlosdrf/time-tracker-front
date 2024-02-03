import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SearchComponent } from 'src/app/components/search/search.component';
import { SharedModule } from 'src/app/components/shared.module';
import { UserListComponent } from 'src/app/components/user-list/user-list.component';
import { CustomDatePipe } from 'src/app/services/custom-date.pipe';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-admin.users',
  standalone: true,
  imports: [SearchComponent, UserListComponent, SharedModule],
  templateUrl: './admin.users.component.html',
  styleUrl: './admin.users.component.scss',
})
export class AdminUsersComponent implements AfterViewInit {
  @ViewChild('appUser', { static: true }) appUser!: ElementRef;
  public loaded: boolean = false;
  public searchForm: FormGroup = new FormGroup({
    searchField: new FormControl(''),
  });
  public users: any;
  public links: any = '';
  public isSlideIn: boolean = false;
  public selectedUser: any;
  constructor(
    private userService: UsersService,
    public customDate: CustomDatePipe
  ) {}

  ngAfterViewInit(): void {
  }
  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers(this.searchForm.value).subscribe((users) => {
      this.users = users;
      console.log(users)
      this.loaded = true;
    });
  }

  loading() {
    this.users = [];
    this.loaded = false;
  }

  userToggle() {
    this.appUser.nativeElement.classList.toggle('visually-hidden');
    this.isSlideIn = !this.isSlideIn;
  }
  setSelectedUser(user: any) {
    this.selectedUser = user;
    if (this.appUser.nativeElement.classList.contains('visually-hidden')) {
      this.appUser.nativeElement.classList.remove('visually-hidden');
    }
    if (!this.isSlideIn) this.isSlideIn = true;
  }
}
