import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SharedModule } from '../shared.module';
import { UsersService } from 'src/app/services/users.service';
import { CompaniesService } from 'src/app/services/companies.service';
import { Company } from 'src/app/models/User.model';

@Component({
  selector: 'app-user-options',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './user-options.component.html',
  styleUrl: './user-options.component.scss',
})
export class UserOptionsComponent implements OnInit {
  @Output() onSelectUserId: EventEmitter<any> = new EventEmitter<any>();
  users: any;
  companies: Company[] = [];
  usersList: any;
  select: string = '';
  byClient: boolean = false;
  role = localStorage.getItem('role');
  constructor(
    private userService: UsersService,
    private companiesService: CompaniesService
  ) {}

  ngOnInit(): void {
    if (this.role == '1') {
      this.getUsers();
      this.getCompanies();
    }
    if (this.role == '3') {
      this.getEmployees();
    }
  }
  handleDisplay(user: any) {
    if (this.byClient) {
      return user.name;
    } else {
      return user.name + ' ' + user.last_name;
    }
  }
  getUsers() {
    let body = {};
    this.userService.getUsers(body).subscribe({
      next: (users) => {
        this.usersList = users.filter((user: any) => user.active == 1);
        this.users = this.usersList.filter(
          (user: any) => user.role === 2 && user.active == 1
        );
      },
      error: (err) => {},
    });
  }
  getEmployees() {
    this.userService.getEmployees().subscribe({
      next: (employees: any) => {
        this.usersList = employees.map((user: any) => user.user);
        this.users = this.usersList.filter((user: any) => user.active == 1);
      },
    });
  }
  getCompanies() {
    this.companiesService.getCompanies().subscribe({
      next: (companies: Company[]) => {
        this.companies = companies;
      },
    });
  }
  toggleCheck() {
    this.byClient = !this.byClient;
    this.select = '';
    if (this.byClient) this.users = this.companies;
    else this.users = this.usersList.filter((user: any) => user.role == 2);
  }

  selectUserId(event: Event) {
    let user;
    const userId = (event.target as HTMLInputElement).value;
    
    if (userId == '0') return this.onSelectUserId.emit({ id: userId });
    user = this.users.find((user: any) => user.id == userId);
    console.log(user)
    this.onSelectUserId.emit(user);
  }
}
