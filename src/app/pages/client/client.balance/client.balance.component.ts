import { Component, OnInit } from '@angular/core';
import { PaymentsService } from 'src/app/services/payments.service';

@Component({
  selector: 'app-client.balance',
  templateUrl: './client.balance.component.html',
  styleUrls: ['./client.balance.component.scss']
})
export class ClientBalanceComponent implements OnInit{
  payments: any

  constructor(private paymentService: PaymentsService){}

  ngOnInit(){
    this.getPayments()
  }

  getPayments(){
    this.paymentService.getPendingBills().subscribe({
      next: v =>{
        console.log(v)
        this.payments = v
      }
    })
  }
}
