import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { PaymentsService } from 'src/app/services/payments.service';

@Component({
  selector: 'app-client.balance',
  templateUrl: './client.balance.component.html',
  styleUrls: ['./client.balance.component.scss']
})
export class ClientBalanceComponent implements OnInit{
  payments: any
  pending: any

  constructor(private paymentService: PaymentsService, private router: Router){}

  ngOnInit(){
    this.getPayments()
    console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
  }

  getPayments(){
    this.paymentService.getPendingBills().subscribe({
      next: v =>{
        this.pending = (v as Array<any>).filter((payment: any)=> payment.status.name === "Pending")
        this.payments = (v as Array<any>).filter((payment: any)=> payment.status.name === "Active")
      }
    })
  }
  setPaymentParams(data: any){
    const paymentParams: NavigationExtras = {
      queryParams: data
    }
    this.router.navigate(['/client/payments'], paymentParams)
  }
}
