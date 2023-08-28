import { Component, OnInit } from '@angular/core';
import { PaymentsService } from 'src/app/services/payments.service';
import { Router, NavigationExtras } from "@angular/router";

@Component({
  selector: 'app-bills',
  templateUrl: './bills.component.html',
  styleUrls: ['./bills.component.scss']
})
export class BillsComponent implements OnInit {
  cantidad: number = 749.99
  currency: string = 'USD'
  billsList: any

  constructor(private billService: PaymentsService, private router: Router){}
  ngOnInit(): void {
    this.getPayments()
    this.checkStatus()
  }
  async checkStatus() {
    const clientSecret = new URLSearchParams(window.location.search).get(
      'payment_intent_client_secret'
    );

    if (!clientSecret) {
      return;
    }

    const { paymentIntent } = await stripe.retrievePaymentIntent(clientSecret);

    switch (paymentIntent.status) {
      case 'succeeded':
        this.showMessage('Payment succeeded!');
        break;
      case 'processing':
        this.showMessage('Your payment is processing.');
        break;
      case 'requires_payment_method':
        this.showMessage('Your payment was not successful, please try again.');
        break;
      default:
        this.showMessage('Something went wrong.');
        break;
    }
  }
  showMessage(messageText: string) {
    const messageContainer = document.querySelector('#payment-message');

    messageContainer!.classList.remove('hidden');
    messageContainer!.textContent = messageText;

    setTimeout(function () {
      messageContainer!.classList.add('hidden');
      messageContainer!.textContent = '';
    }, 4000);
  }
  public getPayments(){
    this.billService.getPendingBills().subscribe({
      next:(v: any) =>{
        console.log(v)
        this.billsList = v.filter((item: any)=>item.status_id === 1)
      },
    })
  }
  setPaymentParams(data: any){
    const paymentParams: NavigationExtras = {
      queryParams: data
    }
    console.log(paymentParams)
    this.router.navigate(['/client/payments'], paymentParams)
  }
}
