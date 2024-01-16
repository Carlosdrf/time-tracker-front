import { ErrorHandler, NgModule } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { JwtInterceptor } from "./services/jwt.interceptor";
import { JwtHelperService, JwtModule, JWT_OPTIONS } from "@auth0/angular-jwt";
// import { AuthGuard } from "./services/auth-guard.service";
// import { notAuthGuard } from "./services/notAuth-guard.service";
import { ReportsService } from "./services/reports.service";
// import { MatDatepicker } from "@angular/material/datepicker";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { NavigationComponent } from './components/navigation/navigation.component';
// import { DashboardComponent } from './pages/dashboard/dashboard.component';

// import { CustomDatePipe } from "./services/custom-date.pipe";
// import { DashboardService } from "./services/dashboard.service";
// import { LoginComponent } from './pages/login/login.component';
// import { ReportsComponent } from './pages/reports/reports.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { CalendarComponent } from './components/calendar/calendar.component';
import { PagesComponent } from './pages/pages.component';
import { WebSocketService } from "./services/socket/web-socket.service";
import { SocketIoModule } from "ngx-socket-io";



import { SharedModule } from "./components/shared.module";
import { UserComponent } from './pages/admin/user/user.component';
import { Loader } from './app.models';
// import { DashboardComponent } from './pages/client/dashboard/dashboard.component';
// import { AdminDashboardComponent } from './pages/admin/dashboard/dashboard.component';
// import { ReportsComponent } from './pages/admin/reports/reports.component';

const jwtOptions = {
  tokenGetter: () => localStorage.getItem('access_token'),
  allowedDomains: ['example.com'],
  disallowedRoutes: ['http://example.com/api/login'],
};

@NgModule({
  declarations: [
    AppComponent,
    // NavigationComponent,
    // DashboardComponent,
    // CustomDatePipe,
    // LoginComponent,
    // CalendarComponent,
    PagesComponent,
    // UserComponent,
    // DashboardComponent,
    // DashboardComponent,
    // ReportsComponent,
  ],
  exports:[
    // CustomDatePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    FormsModule,
    JwtModule,
    SocketIoModule,
    // CustomDatePipe,
    BrowserAnimationsModule,
    // DashboardComponent
    // NgbModule
  ],
  providers: [
    // CustomDatePipe,
    // DashboardService,
    JwtHelperService,
    WebSocketService,
    ReportsService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: JWT_OPTIONS, useValue: jwtOptions },
    // AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
