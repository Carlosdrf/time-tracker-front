import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { JwtInterceptor } from "./services/jwt.interceptor";
import { AuthGuard } from "./services/auth-guard.service";
import { notAuthGuard } from "./services/notAuth-guard.service";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { CustomDatePipe } from "./services/custom-date.pipe";
import { DashboardService } from "./services/dashboard.service";
import { LoginComponent } from './components/login/login.component';
import { ReportsComponent } from './components/reports/reports.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    DashboardComponent,
    CustomDatePipe,
    LoginComponent,
    ReportsComponent,
  ],
  exports:[
    CustomDatePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    DashboardService,
    CustomDatePipe,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
