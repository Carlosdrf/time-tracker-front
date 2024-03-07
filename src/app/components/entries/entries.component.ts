import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CustomDatePipe } from '../../services/custom-date.pipe';
import { EntriesService } from '../../services/entries.service';
import { Entries } from '../../models/Entries';
import { PagesComponent } from '../../pages/pages.component';
import { ModalComponent } from '../modal/modal.component';
import { MatDialog } from '@angular/material/dialog';
import { EntryComponent } from '../entry/entry.component';
import { SharedModule } from '../shared.module';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: ['./entries.component.scss'],
  standalone: true,
  imports: [EntryComponent, SharedModule],
})
export class EntriesComponent implements OnInit {
  @Output() getEntries: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDeleteEntry: EventEmitter<any> = new EventEmitter<any>();
  @Input() entries: any;
  @Input() reviewEntries: any = [];
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

  updateTask(entry: any) {
    this.entriesService
      .updateEntryTask(entry.task_id, entry)
      .subscribe((res) => {
        this.message = res.message;
        this.page.setAlert(this.message);
        this.getEntries.emit();
      });
  }

  updateStart_time(data: any) {
    const { entry, event } = data;
    let input = (event.target as HTMLInputElement).value;
    if (this.regex.test(input)) {
      if (input.length == 3) {
        input = 0 + input;
      }
      const newData = {
        start_time: this.getFormatDate(entry.start_time, input),
        end_time: entry.end_time,
        date: entry.date,
      };
      this.entriesService.updateEntry(entry.id, newData).subscribe({
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
  updateEnd_time(data: any) {
    const { entry, event } = data;
    let input = (event.target as HTMLInputElement).value;
    if (this.regex.test(input)) {
      if (input.length == 3) {
        input = 0 + input;
      }
      const newData = {
        start_time: entry.start_time,
        end_time: this.getFormatDate(entry.start_time, input),
        date: entry.date,
      };
      this.entriesService.updateEntry(entry.id, newData).subscribe({
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
}
