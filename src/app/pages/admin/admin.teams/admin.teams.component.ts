import { Component, OnInit } from '@angular/core';
import { CustomDatePipe } from '../../../services/custom-date.pipe';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  Link,
  UserListComponent,
} from 'src/app/components/user-list/user-list.component';
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
  public searchForm: FormGroup;
  public users: any = [];
  public links: Link[] = [
    { url: '/admin/entries', title: 'Entries' },
    { url: '/reports', title: 'Reports' },
  ];

  constructor(
    private userService: UsersService,
    public customDate: CustomDatePipe,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      searchField: [''],
      filter: this.fb.group({
        status: [true],
        role: [2],
      }),
    });
  }

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
