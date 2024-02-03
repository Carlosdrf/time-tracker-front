import { Component, OnInit } from '@angular/core';
import { EntriesService } from '../../../services/entries.service';
import { Entries } from '../../../models/Entries';
import { Router, Navigation, RouterModule } from '@angular/router';
import { ReportsService } from '../../../services/reports.service';
import { CustomDatePipe } from '../../../services/custom-date.pipe';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-reports',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss'],
})
export class EntriesComponent implements OnInit {
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

  constructor(
    private customDate: CustomDatePipe,
    private entriesService: EntriesService,
    private router: Router,
    private reports: ReportsService
  ) {}

  ngOnInit(): void {
    this.loaded = false;
    this.user = {
      id: localStorage.getItem('userid'),
      name: localStorage.getItem('user_name'),
    };
    // this.user = this.reports.getSelectedUser()
    if (this.user.id) {
      this.getEntries();
      this.getEntryStatus();
    } else {
      this.router.navigateByUrl('/admin/dashboard');
    }
  }

  getEntries() {
    const user = {
      user_id: this.user.id,
    };
    this.entriesService.getUsersEntries(user).subscribe((v) => {
      this.entries = v.filter((item: any) => item.status !== 0);
      this.loaded = true;
    });
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
      if (status.length > 0) {
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
      this.entriesService
        .updateEntry(this.entries[i].id, data)
        .subscribe((v) => {
          this.getEntries();
        });
    } else {
      this.getEntries();
    }
  }
  // public addEntry(){

  // }
  // public endCurrentEntry(){

  // }
  public updateTask(i: number, event: any) {
    this.entriesService
      .updateEntry(this.entries[i].id, this.entries[i])
      .subscribe((v) => {
        // console.log(v)
        this.getEntries();
        // this.getEntryStatus()
      });
  }
  public deleteEntry(id: number) {
    this.entriesService.deleteEntry(id).subscribe((v) => {
      this.getEntries();
      this.getEntryStatus();
    });
  }
}
