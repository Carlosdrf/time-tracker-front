import { Component, OnInit } from '@angular/core';
import { CustomDatePipe } from '../../../services/custom-date.pipe';
import { FormControl, FormGroup } from '@angular/forms';
import { UserListComponent } from 'src/app/components/user-list/user-list.component';
import { SharedModule } from 'src/app/components/shared.module';
import { TimerComponent } from 'src/app/components/timer/timer.component';
import { SearchComponent } from 'src/app/components/search/search.component';
import { UsersService } from 'src/app/services/users.service';
import { userRoles } from 'src/app/app.models';

@Component({
  selector: 'app-admin.teams',
  standalone: true,
  imports: [UserListComponent, SharedModule, TimerComponent, SearchComponent],
  templateUrl: './admin.teams.component.html',
  styleUrl: './admin.teams.component.scss',
})
export class AdminTeamsComponent implements OnInit {
  public loaded: boolean = false;
  public searchForm: FormGroup = new FormGroup({
    searchField: new FormControl(''),
    filter: new FormControl(userRoles.user),
  });
  public users: any = [];
  public links: any = [
    { url: '/admin/entries', title: 'Entries' },
    { url: '/reports', title: 'Reports' },
  ];

  constructor(
    private userService: UsersService,
    public customDate: CustomDatePipe
  ) {}

  ngOnInit() {
    this.loaded = false;
    this.getUsers();
  }

  getUsers() {
    this.userService.getUsers(this.searchForm.value).subscribe((users) => {
      this.users = users.filter((user: any) => user.active !== 0);
      this.loaded = true;
    });
  }

  loading() {
    this.loaded = false;
    this.users = [];
  }

  public getName() {
    const name = localStorage.getItem('name');
    return name;
  }
}
