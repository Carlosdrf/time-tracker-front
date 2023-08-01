import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { StripeService } from 'src/app/services/stripe.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-stripe',
  templateUrl: './stripe.component.html',
  styleUrls: ['./stripe.component.scss'],
})
export class StripeComponent implements AfterViewInit {
  @ViewChild('cardInfo') cardInfo?: ElementRef;
  @ViewChild('emailElement') emailElement?: ElementRef;
  cardError: any;
  card: any;
  email: any;
  data: any

  constructor(private stripeService: StripeService, private router: Router) {}
  ngAfterViewInit(): void {
    const paymentElementOptions = {
      layout: 'tabs',
    };

    this.loadStripe();
    this.checkStatus();
  }
  onChange({ error }: any) {
    if (error) {
      this.cardError = error.message;
    } else {
      this.cardError = null;
    }
  }
  async loadStripe() {
    this.stripeService.charge(100, 1).subscribe((next) => {
      const { clientSecret } = next;
      // console.log(clientSecret)
      const appearance = {
        theme: 'night',
      };
      this.data = {
        amount: 1000,
        description: 'payment',

      }
      elements = stripe.elements({ clientSecret, appearance });

      this.card = elements.create('card');

      this.card.mount(this.cardInfo?.nativeElement);
      const emailAddress = '';
      const linkAuthenticationElement = elements.create('linkAuthentication');
      linkAuthenticationElement.mount('#link-authentication-element');
      // console.log(linkAuthenticationElement.nativeElement)
      // linkAuthenticationElement.attr('placeholder', 'Email address')

      linkAuthenticationElement.on('change', this.change.bind(this));

      const paymentElementOptions = {
        layout: 'tabs',
      };

      const paymentElement = elements.create('payment', paymentElementOptions);
      paymentElement.mount('#payment-element');
    });
    // }else{
    //   this.cardError = null
    // }
  }
  change($event: any) {
    console.log($event.value.email);
    const field = document.getElementById('Field-emailInput');
    console.log(field);
  }
  ngOnInit(): void {
    //     // This is a public sample test API key.
    // // Don’t submit any personally identifiable information in requests made with this key.
    // // Sign in to see your own test API key embedded in code samples.
    // const stripe = Stripe("pk_test_TYooMQauvdEDq54NiTphI7jx");
    // // The items the customer wants to buy
    // const items = [{ id: "xl-tshirt" }];
    // let elements;
    // initialize();
    // checkStatus();
    // document
    //   .querySelector("#payment-form")
    //   .addEventListener("submit", handleSubmit);
    // let emailAddress = '';
    // // Fetches a payment intent and captures the client secret
    // async function initialize() {
    //   const response = await fetch("/create-payment-intent", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ items }),
    //   });
    //   const { clientSecret } = await response.json();
    //   const appearance = {
    //     theme: 'stripe',
    //   };
    //   elements = stripe.elements({ appearance, clientSecret });
    //   const linkAuthenticationElement = elements.create("linkAuthentication");
    //   linkAuthenticationElement.mount("#link-authentication-element");
    //   linkAuthenticationElement.on('change', (event) => {
    //     emailAddress = event.value.email;
    //   });
    //   const paymentElementOptions = {
    //     layout: "tabs",
    //   };
    //   const paymentElement = elements.create("payment", paymentElementOptions);
    //   paymentElement.mount("#payment-element");
    // }
    //
  }
  // // ------- UI helpers -------

  showMessage(messageText: string) {
    const messageContainer = document.querySelector('#payment-message');

    messageContainer!.classList.remove('hidden');
    messageContainer!.textContent = messageText;

    setTimeout(function () {
      messageContainer!.classList.add('hidden');
      messageContainer!.textContent = '';
    }, 4000);
  }
  // Show a spinner on payment submission
  setLoading(isLoading: boolean) {
    if (isLoading) {
      // Disable the button and show a spinner
      // document.querySelector("#submit")!.disabled = true;
      document.querySelector('#spinner')!.classList.remove('hidden');
      document.querySelector('#button-text')!.classList.add('hidden');
    } else {
      // document.querySelector("#submit")!.disabled = false;
      document.querySelector('#spinner')!.classList.add('hidden');
      document.querySelector('#button-text')!.classList.remove('hidden');
    }
  }
  async handleSubmit(e: Event) {
    this.stripeService.webhook(this.data).subscribe()
    e.preventDefault();
    this.setLoading(true);
    console.log(this.data)

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: environment.url + '/client/payments',
        receipt_email: 'crivas@i-nimble.com',
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === 'card_error' || error.type === 'validation_error') {
      this.showMessage(error.message);
    } else {
      this.showMessage('An unexpected error occurred.');
    }

    this.setLoading(false);
  }
  // // Fetches the payment intent status after payment submission
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
}
