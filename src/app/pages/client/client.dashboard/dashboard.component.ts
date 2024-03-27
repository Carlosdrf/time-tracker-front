import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class ClientDashboardComponent implements OnInit {
  name?: any;
  constructor() {}

  ngOnInit(): void {
    this.name = this.getUserName();
  }
  getUserName() {
    const name = localStorage.getItem('name');
    return name;
  }
}
