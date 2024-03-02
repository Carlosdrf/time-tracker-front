import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomDatePipe } from '../../services/custom-date.pipe';
import { EntriesService } from '../../services/entries.service';
import { Entries } from '../../models/Entries';
import { PagesComponent } from '../../pages/pages.component';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss'],
})
export class EntriesComponent implements OnInit {
  @Output() getEntries: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDeleteEntry: EventEmitter<any> = new EventEmitter<any>();
  @Input() entries: any;
  @Input() loaded?: boolean;
  updateDate: Date = new Date();
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
    private entriesService: EntriesService,
    private customDate: CustomDatePipe,
    private page: PagesComponent,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loaded = false;
  }

  deleteEntry(id: number) {
    const dialog = this.dialog.open(ModalComponent, {
      data: { subject: 'entry' },
    });
    dialog.afterClosed().subscribe((option: boolean) => {
      if (option) {
        this.onDeleteEntry.emit(id);
        console.log('delete');
      }
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
      .subscribe((res) => {
        this.message = res.message;
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
  updateStart_time(entry: any, event: Event) {
    let input = (event.target as HTMLInputElement).value;
    if (this.regex.test(input)) {
      if (input.length == 3) {
        input = 0 + input;
      }
      const data = {
        start_time: this.getFormatDate(entry.start_time, input),
        end_time: entry.end_time,
        date: entry.date,
      };
      this.entriesService.updateEntry(entry.id, data).subscribe({
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
  updateEnd_time(entry: any, event: Event) {
    let input = (event.target as HTMLInputElement).value;
    if (this.regex.test(input)) {
      if (input.length == 3) {
        input = 0 + input;
      }
      const data = {
        start_time: entry.start_time,
        end_time: this.getFormatDate(entry.start_time, input),
        date: entry.date,
      };
      this.entriesService.updateEntry(entry.id, data).subscribe({
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
  transform(value: Date) {
    return this.customDate.transform(value, 'HH:mm');
  }
  public isToday(date: any) {
    const yesterday = this.customDate.transform(
      new Date(Date.now() - 24 * 60 * 60 * 1000),
      'DD-MM-YYYY'
    );
    const today = this.customDate.transform(new Date(), 'DD-MM-YYYY');
    const compareDate = this.customDate.transform(
      date.toLocaleString(),
      'DD-MM-YYYY'
    );
    if (compareDate === today) {
      return 'Today';
    } else if (compareDate === yesterday) {
      return 'Yesterday';
    } else {
      return false;
    }
  }
}
