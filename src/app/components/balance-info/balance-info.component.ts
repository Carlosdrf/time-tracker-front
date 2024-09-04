import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SharedModule } from '../shared.module';

@Component({
  selector: 'app-balance-info',
  standalone: true,
  imports: [ SharedModule ],
  templateUrl: './balance-info.component.html',
  styleUrl: './balance-info.component.scss'
})
export class BalanceInfoComponent implements OnInit {
  @Input() payments?: any;
  @Input() pending?: any;
  transactionCount: number = 0
  totalSpent: number = 0
  debtBalance: number = 0
  cards = [
    { title: 'Debt balance', content: this.debtBalance, icon: 'credit_card' },
    { title: 'Total spent', content: this.totalSpent, icon: 'account_balance_wallet' },
    { title: 'Transaction count', content: this.transactionCount, icon: 'done_all' }
  ];

  colSpan: number = 3;

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver.observe([
      Breakpoints.Handset
    ]).subscribe(result => {
      this.colSpan = result.matches ? 3 : 1;
    });
  }
  
  ngOnInit(): void {
    this.updateCounts()
  }
  
  ngOnChanges(changes: SimpleChanges) {
    if (changes['payments'] || changes['pending']) {
      // Handle the changes here
      this.updateCounts()
    }
  }
  updateCounts() {
    if (this.payments) {
      // Calculate total spent and transaction count
      this.transactionCount = this.payments.length;
      this.totalSpent = this.payments.reduce((acc:number, payment:any) => acc + payment.amount, 0);
    }
    if (this.pending) {
      // Calculate debt balance
      this.debtBalance = this.pending.reduce((acc:number, bill:any) => acc + bill.amount, 0);
    }
    // Update the cards array
    this.cards = [
      { title: 'Debt balance', content: this.debtBalance, icon: 'credit_card' },
      { title: 'Total spent', content: this.totalSpent, icon: 'account_balance_wallet' },
      { title: 'Transaction count', content: this.transactionCount, icon: 'done_all' }
    ];
  }

  getColspan() {
    return this.colSpan;
  }
}