import { Component, Input, OnInit } from '@angular/core';
import { EmployeesService } from 'src/app/services/employees.service';
import { ReportsService } from 'src/app/services/reports.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit{
  employees: any = []
  constructor(private employeesService: EmployeesService, private reports: ReportsService){}

  ngOnInit(): void {
    this.getEmployees()
  }
  getEmployees(){
    this.employeesService.getEmployees().subscribe({
      next: employees=>{
        this.employees = employees
        console.log(this.employees)
      }
    })
  }
  onSelectUser(data:any){
    this.reports.setUserInformation(data)
  }
  resetUserReport(){
    this.reports.resetUser()
  }
}
