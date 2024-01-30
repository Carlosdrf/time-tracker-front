import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as moment from 'moment';
import {
  Subscription,
  debounceTime,
  distinctUntilChanged,
  interval,
} from 'rxjs';
import { SearchComponent } from 'src/app/components/search/search.component';
import { SharedModule } from 'src/app/components/shared.module';
import { TimerComponent } from 'src/app/components/timer/timer.component';
import { UserListComponent } from 'src/app/components/user-list/user-list.component';
import { Entries } from 'src/app/models/Entries';
import { CustomDatePipe } from 'src/app/services/custom-date.pipe';
import { DashboardService } from 'src/app/services/dashboard.service';
import { ReportsService } from 'src/app/services/reports.service';
import { WebSocketService } from 'src/app/services/socket/web-socket.service';

@Component({
  selector: 'app-admin.users',
  standalone: true,
  imports: [SearchComponent, UserListComponent, SharedModule, TimerComponent],
  templateUrl: './admin.users.component.html',
  styleUrl: './admin.users.component.scss',
})
export class AdminUsersComponent {
  loaded: boolean = false;
  usersInfo: any;
  hours: any;
  start_date: string = '';
  end_time: any;
  entries: any = [];
  regex = /^\d+$/;
  searchForm: FormGroup = new FormGroup({ searchField: new FormControl('') });
  entry: Entries = {
    status: 0,
    task: '',
    start_time: new Date(),
    end_time: new Date(),
  };
  updateDate: Date = new Date();
  entryCheck: string = '';
  currentEntryId: number = 0;
  users: any;
  timer: any;
  entriesTest: any;
  subscription: Subscription[] = [];

  constructor(
    private socketService: WebSocketService,
    private reportsService: ReportsService,
    private dashboardService: DashboardService,
    public customDate: CustomDatePipe,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.getWeek();
    this.getUsers();
    // this.searchForEntries();
    this.socketService.socket.on('server:closedEntry', () => {
      this.subscription.forEach((sub) => sub.unsubscribe());
      this.getEntries();
    });
    this.socketService.socket.on('server:admin:newEntry', () => {
      this.getEntries();
    });
  }
  getUsers() {
    this.dashboardService.getUsers(this.searchForm.value).subscribe((users) => {
      this.users = users;
      this.getEntries();
    });
  }
  getEntries() {
    const data = {
      start_time: this.start_date,
      end_time: new Date(this.end_time).toUTCString(),
    };
    this.dashboardService.getAllEntries(data).subscribe((entries) => {
      this.entries = entries;
      this.filterUsersData(this.entries, this.users);
    });
  }
  loading(){
    this.usersInfo = []
    this.loaded = false
  }
  /**
   *
   * @param entries represents the logs of all the users
   * @param users
   * Append the entries to their respective users
   */
  filterUsersData(entries: any, users: any) {
    let acc: number;
    let usersInfo = users.map((element: any) => {
      acc = 0;
      entries.forEach((entry: any) => {
        if (element.id == entry.user_id) {
          acc += this.getHours(entry.start_time, entry.end_time);
        }
      });
      let status = entries.filter(
        (item: any) => item.status === 0 && item.user_id === element.id
      );
      if (status.length > 0) {
        let timer = interval(1000).subscribe(() => {
          element.started = this.customDate.getTotalHours(status[0].start_time);
          element.timeRef = this.getTimeAgo(element.started.split(':'));
        });
        this.subscription.push(timer);
        element.status = status[0].status;
      } else {
        element.started = '00:00:00';
        element.timeRef = null;
        element.status = null;
      }
      element.totalHours = this.formatHours(acc);
      return element;
    });
    this.usersInfo = usersInfo;
    this.loaded = true;
  }

  getTimeAgo(time: Array<any>) {
    if (time[1] == '00') return 'seconds';
    if (time[0] == '00') return 'minutes';
    return 'hours';
  }
  socketUpdated(user_id: any, data: any) {
    this.usersInfo = this.usersInfo.map((element: any) => {
      if (element.id === user_id[0]) {
        if (user_id[1].status == 0) {
          element.status = user_id[1].status;
          let timer = interval(1000).subscribe(() => {
            element.started = this.customDate.getTotalHours(
              user_id[1].start_time
            );
          });
          this.subscription.push(timer);
        } else {
          element.status = null;
          element.started = '00:00:00';
        }
      }
      return element;
    });
  }

  getHours(start_time: Date, end_time: Date) {
    const diff = new Date(end_time).getTime() - new Date(start_time).getTime();
    const total = diff / (60 * 60 * 1000);
    return total;
  }

  getWeek() {
    const firstdayWeek = moment().isoWeekday(1).format('YYYY/MM/DD');
    const today = moment().format('YYYY-MM-DD');
    // if(firstdayWeek == today){
    const now = new Date();
    // this.start_date = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)).format('YYYY-MM-DD')
    // this.end_time = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)).format('YYYY-MM-DD')
    // }else{
    this.start_date = firstdayWeek;
    this.end_time = firstdayWeek;
    // this.end_time = moment().isoWeekday(7).format('YYYY-MM-DD');
    // }
  }

  formatHours(amountHours: number) {
    const hours = Math.floor(amountHours);
    const minutes = Math.floor((amountHours - hours) * 60);
    const seconds = Math.floor(((amountHours - hours) * 60 - minutes) * 60);
    return (
      this.padZero(hours) +
      ':' +
      this.padZero(minutes) +
      ':' +
      this.padZero(seconds)
    );
  }
  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  getEntryStatus() {
    this.dashboardService.getEntryCheck().subscribe((res) => {
      const status = res as Array<any>;
      if (status.length > 0) {
        this.currentEntryId = status[0].id;
        if (status[0].status === 0) {
          this.entryCheck = 'started';
        } else {
          this.entryCheck = 'ended';
        }
      } else {
        this.entryCheck = 'no entries';
      }
    });
  }

  // timeFormat(event: any, i: number){
  //   event.target.value = event.target.value.replace(/:/g, '')
  // }

  // getFormatDate(date: any, value: any){
  //   const seconds = this.customDate.transform(date, 'ss')
  //   const [newHour, newMinute] = [value.slice(0,2), value.slice(2)]
  //   const dateformat = this.customDate.transform(date, 'YYYY-MM-DD')
  //   const [year, month, day] = dateformat.split('-')
  //   this.updateDate.setFullYear(Number(year), Number(month), Number(day))
  //   this.updateDate.setHours(Number(newHour), Number(newMinute), Number(seconds))
  //   return this.updateDate;
  // }

  // transform(value: Date){
  //   return this.customDate.transform(value, 'HH:mm')
  // }


}
