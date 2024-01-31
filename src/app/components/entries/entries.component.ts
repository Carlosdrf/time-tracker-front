import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomDatePipe } from '../../services/custom-date.pipe';
import { EntriesService } from '../../services/entries.service';
import { Entries } from '../../models/Entries';
import { PagesComponent } from '../../pages/pages.component';
import { WebSocketService } from 'src/app/services/socket/web-socket.service';
// import * as moment from 'moment';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss'],
})
export class EntriesComponent implements OnInit {
  @Output() getEntries: EventEmitter<any> = new EventEmitter<any>();
  @Input() entries: any;
  @Input() loaded?: boolean;
  updateDate: Date = new Date();
  entryCheck: string = '';
  currentEntryId: number = 0;
  timer: any = '00:00:00';
  currenttime: any;
  message: any;
  offHours: boolean = false;
  morebtn?: any;
  menuoff?: any;
  regex = /^\d+$/;
  entry: Entries = {
    status: 0,
    task: '',
    start_time: new Date(),
    end_time: new Date(),
  };
  constructor(
    private socketService: WebSocketService,
    private entriesService: EntriesService,
    private customDate: CustomDatePipe,
    private page: PagesComponent
  ) {}

  ngOnInit() {
    this.loaded = false;
    // this.socketService.connect()
  }

  // getEntries(){
  //   this.entriesService.getEntries().subscribe(
  //     (v) => {
  //       this.entries = v.result;
  //       if(v.token !== null){
  //         localStorage.setItem('jwt', v.token)
  //       }
  //       this.loaded = true
  //     }
  //   )
  // }

  deleteEntry(id: number) {
    this.entriesService.deleteEntry(id).subscribe((v) => {
      this.getEntries.emit();
      this.message = 'Entry deleted!';
      this.page.setAlert(this.message);
    });
  }
  getTotalHours(start: Date, end: Date) {
    const [startformat, endformat] = [new Date(start), new Date(end)];
    const starts = startformat.getTime();
    const ends = endformat.getTime();
    const difference = ends - starts;
    const hours = Math.floor(difference / 1000 / 60 / 60);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);
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
  timeFormat(event: any, i: number) {
    event.target.value = event.target.value.replace(/:/g, '');
  }
  updateTask(i: number, event: any) {
    this.entriesService
      .updateEntryTask(this.entries[i].task_id, this.entries[i])
      .subscribe((v) => {
        console.log(v);
        this.message = 'Task updated successfully!';
        this.page.setAlert(this.message);
        this.getEntries.emit();
      });
  }
  setUpdateData(date: Date, value: any, entry: any) {
    return {
      start_time: this.getFormatDate(date, value),
      end_time: entry.end_time,
      date: entry.date,
    };
  }
  updateStart_time(date: Date, event: any, i: number) {
    if (this.regex.test(event.target.value)) {
      if (event.target.value.length == 3) {
        event.target.value = 0 + event.target.value;
      }
      const data = this.setUpdateData(
        date,
        event.target.value,
        this.entries[i]
      );
      this.entriesService.updateEntry(this.entries[i].id, data).subscribe({
        next: () => {
          this.getEntries.emit();
          this.message = 'Start time updated successfully!';
          this.page.setAlert(this.message);
        },
        error: (e) => {
          this.message = e.error.message;
          this.page.setAlert(this.message);
          this.getEntries.emit();
        },
      });
    } else {
      this.getEntries.emit();
    }
  }
  updateEnd_time(date: Date, event: any, i: number) {
    if (this.regex.test(event.target.value)) {
      if (event.target.value.length == 3) {
        event.target.value = 0 + event.target.value;
      }
      const data = this.setUpdateData(
        date,
        event.target.value,
        this.entries[i]
      );

      this.entriesService.updateEntry(this.entries[i].id, data).subscribe({
        next: (v) => {
          this.getEntries.emit();
          this.message = 'End time updated successfully!';
          this.page.setAlert(this.message);
        },
        error: (e) => {
          this.message = e.error.message;
          this.page.setAlert(this.message);
          this.getEntries.emit();
        },
      });
    } else {
      this.getEntries.emit();
    }
  }
  getFormatDate(date: any, value: any) {
    const seconds = this.customDate.transform(date, 'ss');
    const [newHour, newMinute] = [value.slice(0, 2), value.slice(2)];
    const dateformat = this.customDate.transform(date, 'YYYY-MM-DD');
    const [year, month, day] = dateformat.split('-');
    this.updateDate.setFullYear(Number(year), Number(month), Number(day));
    this.updateDate.setHours(
      Number(newHour),
      Number(newMinute),
      Number(seconds)
    );
    return this.updateDate;
  }
  transform(value: Date) {
    return this.customDate.transform(value, 'HH:mm');
  }
  public isToday(date: any) {
    const yesterday = this.customDate.transform(
      new Date(Date.now() - 24 * 60 * 60 * 1000),
      'DD-MM-YYYY'
    );
    const today = this.customDate.transform(new Date(), 'DD-MM-YYYY');
    // console.log(date)
    const compareDate = this.customDate.transform(
      date.toLocaleString(),
      'DD-MM-YYYY'
    );
    // console.log(compareDate)
    // console.log(yesterday)
    if (compareDate === today) {
      return 'Today';
    } else if (compareDate === yesterday) {
      return 'Yesterday';
    } else {
      return false;
    }
  }
}
