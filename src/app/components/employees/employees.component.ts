import { Component, Input, OnInit } from '@angular/core';
import { EmployeesService } from 'src/app/services/employees.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit{
  employees: any
  constructor(private employeesService: EmployeesService){}

  ngOnInit(): void {
    this.getEmployees()
  }
  getEmployees(){
    this.employeesService.getEmployees().subscribe({
      next: employees=>{
        this.employees = employees
      }
    })
  }
}
