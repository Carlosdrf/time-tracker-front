import { Component } from '@angular/core';

@Component({
  selector: 'app-client.customer-service',
  templateUrl: './client.customer-service.component.html',
  styleUrls: ['./client.customer-service.component.scss'],
})
export class ClientCustomerServiceComponent {
  role: string = localStorage.getItem('role') || '';
  url!: string;

  ngOnInit() {
    console.log(this.role);
    if (this.role == '2')
      this.url = 'https://forms.office.com/r/efpQc3zkbg?origin=lprLink';
    else this.url = 'https://forms.office.com/r/4jCN9nLgYM';
  }
}
