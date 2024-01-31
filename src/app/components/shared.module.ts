import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { AuthService } from "../services/auth.service";

// import { EntriesService } from "../services/entries.service";
import { CustomDatePipe } from '../services/custom-date.pipe';
// import { Entries } from '../models/Entries';

import { NavigationComponent } from './navigation/navigation.component';
import { CalendarComponent } from './calendar/calendar.component';
import { calendarFormat } from 'moment';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
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
import { UserListComponent } from './user-list/user-list.component';
import { SearchComponent } from './search/search.component';

// import { calendarFormat } from "moment";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    // CalendarComponent
    // CustomDatePipe
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    // MatRippleModule,
    // MatNativeDateModule
  ],
  declarations: [
    NavigationComponent,
    CalendarComponent,
    CustomDatePipe,
    EntriesComponent,
    EntriesPanelComponent,
    BillsComponent,
    StripeComponent,
    EmployeesComponent,
    LoaderComponent,
    PaymentHistoryComponent,
    BalanceComponent,
    // UserListComponent,
  ],
  exports: [
    EntriesComponent,
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
    EmployeesComponent,
    MatCardModule,
    BillsComponent,
    PaymentHistoryComponent,
    LoaderComponent,
    BalanceComponent,
    CommonModule,
    RouterModule,
    // UserListComponent,
  ],
  providers: [CustomDatePipe, CalendarComponent],
})
export class SharedModule {}
