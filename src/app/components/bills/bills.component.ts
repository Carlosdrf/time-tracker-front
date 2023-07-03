import { Component } from '@angular/core';

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss']
})
export class BillsComponent {
  cantidad: number = 749.99
  currency: string = 'USD'
}
