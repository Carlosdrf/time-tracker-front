import { Component, Input, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  employees: any = [];
  constructor(private userService: UsersService) {}

  ngOnInit(): void {
    this.getEmployees();
  }
  getEmployees() {
    this.userService.getEmployees().subscribe({
      next: (employees: any) => {
        this.employees = employees.filter((user: any) => user.user.active == 1);
      },
    });
  }
  onSelectUser(data: any) {
    this.userService.setUserInformation(data);
  }
  resetUserReport() {
    this.userService.resetUser();
  }
}
