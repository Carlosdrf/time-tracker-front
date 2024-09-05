import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { PaymentsService } from 'src/app/services/payments.service';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { SharedModule } from 'src/app/components/shared.module';
import { PdfInvoiceService } from 'src/app/services/pdf-invoice.service';
import { PendingInvoicesCounter } from 'src/app/components/pending-invoices-counter/pending-invoices-counter.component';
import { BehaviorSubject } from 'rxjs';


@Component({
  selector: 'app-client.balance',
  templateUrl: './client.balance.component.html',
  styleUrls: ['./client.balance.component.scss'],
  standalone: true,
  imports: [SharedModule, MatTableModule, MatPaginatorModule, PendingInvoicesCounter],
})
export class ClientBalanceComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pending: any[] = [];
  pending$: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  selectedPayment: any;
  name?: any

  displayedColumns: string[] = ['date', 'description', 'amount', 'status', 'actions'];
  dataSource = new MatTableDataSource<any>();

  constructor(
    private paymentService: PaymentsService,
    private router: Router,
    private pdfInvoiceService: PdfInvoiceService
  ) {}

  ngOnInit() {
    this.getPayments();
    this.name = this.getUserName()
  }
  getPending() {
    if (this.pending && this.pending.length > 0) return true;
    return false;
  }
  getPayments() {
    this.paymentService.getPendingBills().subscribe({
      next: (v) => {
        this.pending = (v as Array<any>).filter(
          (payment: any) => payment.status.name === 'Pending'
        );
        this.dataSource.data = this.pending;
        this.dataSource.paginator = this.paginator;
        this.pending$.next(this.pending);
      },
    });
  }
  setPaymentParams(data: any) {
    const paymentParams: NavigationExtras = {
      queryParams: data,
    };
    this.router.navigate(['/client/payments'], paymentParams);
  }
  viewMore(payment: any) {
    this.selectedPayment = payment; 
  }
  getUserName(){
    const name = localStorage.getItem('name')
    return name;
  }
  downloadPDF() {
    this.pdfInvoiceService.generatePDF(this.name, this.selectedPayment);
  }
}
