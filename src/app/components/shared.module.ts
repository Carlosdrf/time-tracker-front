import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CustomDatePipe } from '../services/custom-date.pipe';

import { NavigationComponent } from './navigation/navigation.component';
import { CalendarComponent } from './calendar/calendar.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { EntriesComponent } from './entries/entries.component';
import { EntriesPanelComponent } from './entries-panel/entries-panel.component';
import { BillsComponent } from './bills/bills.component';
import { StripeComponent } from './stripe/stripe.component';
import { EmployeesComponent } from './employees/employees.component';
import { LoaderComponent } from './loader/loader.component';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { BalanceComponent } from './balance/balance.component';
import { CompaniesService } from '../services/companies.service';
import { UserComponent } from './user/user.component';
import { GoBackComponent } from './go-back/go-back.component';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    // MatRippleModule,
    // MatNativeDateModule
  ],
  declarations: [
    NavigationComponent,
    CalendarComponent,
    CustomDatePipe,
    EntriesPanelComponent,
    BillsComponent,
    StripeComponent,
    EmployeesComponent,
    LoaderComponent,
    PaymentHistoryComponent,
    BalanceComponent,
    UserComponent,
    GoBackComponent,
  ],
  exports: [
    // EntriesComponent,
    EntriesPanelComponent,
    NavigationComponent,
    CalendarComponent,
    FormsModule,
    CustomDatePipe,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    StripeComponent,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    EmployeesComponent,
    MatCardModule,
    BillsComponent,
    PaymentHistoryComponent,
    LoaderComponent,
    BalanceComponent,
    GoBackComponent,
    CommonModule,
    UserComponent,
    RouterModule,
  ],
  providers: [CustomDatePipe, CalendarComponent, CompaniesService],
})
export class SharedModule {}
