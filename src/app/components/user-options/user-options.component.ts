import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SharedModule } from '../shared.module';
import { UsersService } from 'src/app/services/users.service';

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
  usersList: any;
  select: string = '';
  byClient: boolean = false;
  role = localStorage.getItem('role');
  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    if (this.role == '1') {
      this.getUsers();
    }
    if (this.role == '3') {
      this.getEmployees();
    }
  }
  handleDisplay(user: any) {
    if (this.byClient) {
      return user.company.name;
    } else {
      return user.name + ' ' + user.last_name;
    }
  }
  getUsers() {
    let body = {};
    this.userService.getUsers(body).subscribe({
      next: (users) => {
        this.usersList = users.filter((user:any)=> user.active == 1);
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
        this.users = this.usersList.filter(
          (user: any) => user.active == 1
        );
      },
    });
  }
  toggleCheck() {
    this.byClient = !this.byClient;
    this.select = '';
    if (this.byClient)
      this.users = this.usersList.filter((user: any) => user.role == 3);
    else this.users = this.usersList.filter((user: any) => user.role == 2);
  }

  selectUserId(event: Event) {
    const userId = (event.target as HTMLInputElement).value;

    let user;
    if (userId == '0') return this.onSelectUserId.emit({ id: userId });
    user = this.usersList.find((user: any) => user.id == userId);
    this.onSelectUserId.emit(user);
  }
}
