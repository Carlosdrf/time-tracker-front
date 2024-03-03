import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { userRoles } from 'src/app/app.models';
import { SearchComponent } from 'src/app/components/search/search.component';
import { SharedModule } from 'src/app/components/shared.module';
import { TimerComponent } from 'src/app/components/timer/timer.component';
import { UserListComponent } from 'src/app/components/user-list/user-list.component';
import { CustomDatePipe } from 'src/app/services/custom-date.pipe';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-employees',
  standalone: true,
  imports: [UserListComponent, SharedModule, TimerComponent, SearchComponent],
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent {
  public loaded: boolean = false;
  public searchForm: FormGroup = new FormGroup({
    searchField: new FormControl(''),
    filter: new FormControl(userRoles.user)
  });
  public users: any = [];
  public employees: any = [];
  public links: any = [
    { url: '/user/entries', title: 'Entries' },
    { url: '/reports', title: 'Reports' },
  ];

  constructor(
    private userService: UsersService,
    public customDate: CustomDatePipe,
  ) {}

  ngOnInit() {
    this.loaded = false;
    this.getUsers();
  }

  getUsers() {
    forkJoin([
      this.userService.getEmployees(),
      this.userService.getUsers(this.searchForm.value)
    ]).subscribe(([employees, users]) => {
      this.employees = employees;
      const employeeUserIds = this.employees.map((employee: any) => employee.user_id);
      this.users = users.filter((user: any) => {
        this.loaded = true
        return employeeUserIds.includes(user.id);
      });
    });
  }
  
  loading() {
    this.loaded = false;
    this.users = [];
    this.employees = []
  }

  public getName() {
    const name = localStorage.getItem('name');
    return name;
  }
}
