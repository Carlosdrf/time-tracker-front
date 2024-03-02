import { Component, OnInit } from '@angular/core';
import { EntriesService } from '../../../services/entries.service';
import { Entries } from '../../../models/Entries';
import { Router } from '@angular/router';
import { CustomDatePipe } from '../../../services/custom-date.pipe';
import * as moment from 'moment';
import { PagesComponent } from '../../pages.component';

@Component({
  selector: 'app-reports',
  templateUrl: './admin.entries.component.html',
  styleUrls: ['./admin.entries.component.scss'],
})
export class EntriesComponent implements OnInit {
  currentEntryId: string = '';
  regex = /^\d+$/;
  entry: Entries = {
    status: 0,
    task: '',
    start_time: new Date(),
    end_time: new Date(),
    description: '',
  };
  entries: any;
  user: any;
  entryCheck: any;
  updateDate: Date = new Date();
  loaded!: boolean;
  isActive: boolean = false;
  datesRange: any = { firstSelect: '', lastSelect: '' };
  calendarHead: any;
  message: string = '';

  constructor(
    private customDate: CustomDatePipe,
    private entriesService: EntriesService,
    private router: Router,
    private page: PagesComponent
  ) {}

  ngOnInit(): void {
    this.loaded = false;
    document.addEventListener('click', this.onClick.bind(this));

    this.user = {
      id: localStorage.getItem('userid'),
      name: localStorage.getItem('user_name'),
    };
    if (this.user.id) {
      this.getEntries();
      // this.getEntryStatus();
    } else {
      this.router.navigateByUrl('/admin/dashboard');
    }
  }

  getEntries() {
    let user: any;
    user = {
      user_id: this.user.id,
    };
    // console.log(this.datesRange)
    if (this.datesRange.firstSelect) {
      user.start_time = new Date(this.datesRange.firstSelect);
      user.end_time = new Date(this.datesRange.lastSelect);
    }

    this.entriesService.getAllEntries(user).subscribe((entries) => {
      this.entries = entries.filter((item: any) => item.status !== 0);
      if (entries.length == 0 && this.datesRange.firstSelect) {
        this.message = 'No logs in the dates selected';
      }
      this.loaded = true;
    });
  }

  onClick(event: MouseEvent): void {
    if (!(event.target as HTMLElement).closest('#content')) {
      this.isActive = false;
    }
  }
  getTotalHours(start: Date, end: Date) {
    const [startformat, endformat] = [new Date(start), new Date(end)];
    const start_time = startformat.getTime();
    const end_time = endformat.getTime();
    const diff = end_time - start_time;
    const hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor((diff / 1000 / 60) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return `${this.padzero(hours)}:${this.padzero(minutes)}:${this.padzero(
      seconds
    )}`;
  }

  public padzero(num: number): string {
    return num > 9 ? `${num}` : `0${num}`;
  }
  public timeFormat(event: any, i: number) {
    event.target.value = event.target.value.replace(/:/g, '');
  }
  public isToday(date: Date) {
    const yesterday = this.customDate.transform(
      new Date(Date.now() - 24 * 60 * 60 * 1000),
      'DD-MM-YYYY'
    );
    const today = this.customDate.transform(new Date(), 'DD-MM-YYYY');
    const compareDate = this.customDate.transform(date, 'DD-MM-YYYY');
    if (compareDate === today) {
      return 'Today';
    } else if (compareDate === yesterday) {
      return 'Yesterday';
    } else {
      return false;
    }
  }

  public getEntryStatus() {
    const user = {
      id: this.user.id,
    };
    this.entriesService.getUserEntryStatus(user).subscribe((res) => {
      const status = res as Array<any>;
      console.log(status);
      console.log('status');
    });
  }
  updateStart_time(date: Date, event: any, i: number) {
    if (this.regex.test(event.target.value)) {
      if (event.target.value.length == 3) {
        event.target.value = 0 + event.target.value;
      }
      const data = {
        start_time: this.getFormatDate(date, event.target.value),
        end_time: this.entries[i].end_time,
        date: this.entries[i].date,
      };
      this.entriesService
        .updateEntry(this.entries[i].id, data)
        .subscribe((v) => {
          this.getEntries();
        });
    } else {
      this.getEntries();
    }
  }
  getFormatDate(date: Date, value: any) {
    const seconds = this.customDate.transform(date, 'ss');
    const [newHour, newMinute] = [value.slice(0, 2), value.slice(2)];
    const newYear = new Date(date).getFullYear();
    const newMonth = new Date(date).getMonth();
    const newDay = new Date(date).getDate();
    const newDate = new Date(
      newYear,
      newMonth,
      newDay,
      Number(newHour),
      Number(newMinute),
      Number(seconds)
    );

    return newDate;
  }

  updateEnd_time(date: Date, event: any, i: number) {
    if (this.regex.test(event.target.value)) {
      if (event.target.value.length == 3) {
        event.target.value = 0 + event.target.value;
      }
      const data = {
        start_time: this.entries[i].start_time,
        end_time: this.getFormatDate(date, event.target.value),
        date: this.entries[i].date,
      };
      console.log(data)
      // this.entriesService
      //   .updateEntry(this.entries[i].id, data)
      //   .subscribe((v) => {
      //     this.getEntries();
      //   });
    } else {
      this.getEntries();
    }
  }
  public addEntry(data: any) {}
  public endCurrentEntry(data: any) {}
  public updateTask(i: number, event: any) {
    this.entriesService
      .updateEntry(this.entries[i].id, this.entries[i])
      .subscribe((v) => {
        this.getEntries();
      });
  }
  public deleteEntry(id: number) {
    this.entriesService.deleteEntry(id).subscribe((v) => {
      this.message = 'Entry deleted!';
      this.page.setAlert(this.message);
      this.getEntries();
      // this.getEntryStatus();
    });
  }
  public toggleCalendar() {
    this.isActive = !this.isActive;
  }
  setDatesGroup(dateRange: any) {
    this.toggleCalendar();
  }
  resetDates() {
    this.datesRange.firstSelect = '';
    this.datesRange.lastSelect = '';
    this.getEntries();
  }
}
