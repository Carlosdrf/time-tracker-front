import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { SharedModule } from '../shared.module';
import { EntriesService } from 'src/app/services/entries.service';
import * as moment from 'moment';
import { WebSocketService } from 'src/app/services/socket/web-socket.service';
import { Subscription, interval } from 'rxjs';
import { CustomDatePipe } from 'src/app/services/custom-date.pipe';
import { Entry } from 'src/app/models/Entries';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './timer.component.html',
  styleUrl: './timer.component.scss',
})
export class TimerComponent implements OnChanges, OnInit {
  @Input() user: any;
  start_date: string = moment().format('YYYY/MM/DD');
  end_date: string = moment().format('YYYY/MM/DD');
  private subscription: Subscription[] = [];
  private entries: any;
  public entry: Entry = {
    start_time: null,
    status: null,
    timeRef: undefined,
    started: '',
    totalHours: '',
  };
  constructor(
    private entriesService: EntriesService,
    private socketService: WebSocketService,
    private customDate: CustomDatePipe
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.getEntries();
  }

  ngOnInit(): void {
    this.socketService.socket.on('server:closedEntry', () => {
      this.subscription.forEach((sub) => sub.unsubscribe());
      this.getEntries();
    });
    this.socketService.socket.on('server:admin:newEntry', () => {
      this.getEntries();
    });
  }

  getEntries() {
    const data = {
      user_id: this.user.id,
      start_time: new Date(this.start_date).toUTCString(),
      end_time: new Date(this.end_date).toUTCString(),
    };
    this.entriesService.getAllEntries(data).subscribe(({ entries }) => {
      this.entries = entries;
      this.filterUsersData(this.entries, this.user);
    });
  }
  /**
   *
   * @param entries represents the logs of all the users
   * @param users
   * Append the entries to their respective users
   */
  filterUsersData(entries: any, user: any) {
    let acc: number = 0;
    entries.forEach((entry: any) => {
      if (user.id == entry.user_id) {
        acc += this.getHours(entry.start_time, entry.end_time);
      }
    });
    let status = entries.find(
      (item: any) => item.status === 0 && item.user_id === user.id
    );
    if (status) {
      this.entry.start_time = status.start_time;
      let timer = interval(1000).subscribe(() => {
        this.entry.started = this.customDate.getTotalHours(status.start_time);
        this.entry.timeRef = this.getTimeAgo(this.entry.started.split(':'));
      });
      this.subscription.push(timer);
      this.entry.status = status.status;
    } else {
      this.entry.start_time = null;
      this.entry.started = '00:00:00 sec';
      this.entry.timeRef = null;
      this.entry.status = null;
    }
    this.entry.totalHours = this.formatHours(acc);
  }

  getTimeAgo(time: Array<any>) {
    if (time[1] == '00' && time[0] == '00') return 'sec';
    if (time[0] == '00') return 'min';
    return 'hours';
  }

  getHours(start_time: Date, end_time: Date) {
    const diff = new Date(end_time).getTime() - new Date(start_time).getTime();
    const total = diff / (60 * 60 * 1000);
    return total;
  }

  getWeek() {
    const firstdayWeek = moment().isoWeekday(1).format('YYYY/MM/DD');
    const today = moment().format('YYYY/MM/DD');
    // if(firstdayWeek == today){
    // const now = new Date();
    // this.start_date = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)).format('YYYY-MM-DD')
    // this.end_time = moment(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)).format('YYYY-MM-DD')
    // }else{
    this.start_date = firstdayWeek;
    this.end_date = today;
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
}
