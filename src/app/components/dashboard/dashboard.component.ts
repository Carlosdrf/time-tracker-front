import { Component } from '@angular/core';
import { DashboardService } from "../../services/dashboard.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(private dashboardService: DashboardService){}
  ngOnInit(){
    this.dashboardService.getEntries().subscribe(
      res => console.log(res),
      err =>console.error(err)
    )
  }

}
