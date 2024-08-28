import { Component, OnInit, inject } from '@angular/core';
import { EntriesService } from '../../../services/entries.service';
import { Entries } from '../../../models/Entries';
import { Router } from '@angular/router';
import { CustomDatePipe } from '../../../services/custom-date.pipe';
import { SharedModule } from 'src/app/components/shared.module';
import { EntriesComponent } from 'src/app/components/entries/entries.component';
import { UsersService } from 'src/app/services/users.service';
import { Location } from '@angular/common';
import { NotificationStore } from 'src/app/stores/notification.store';

@Component({
  selector: 'app-reports',
  templateUrl: './admin.entries.component.html',
  styleUrls: ['./admin.entries.component.scss'],
  standalone: true,
  imports: [SharedModule, EntriesComponent],
})
export class AdminEntriesComponent implements OnInit {
  store = inject(NotificationStore);
  currentEntryId: string = '';
  regex = /^\d+$/;
  entry: Entries = {
    status: 0,
    task: '',
    start_time: new Date(),
    end_time: new Date(),
    description: '',
  };
  reviewEntries: any = [];
  entries: any;
  user: any = { id: null, name: null };
  entryCheck: any;
  updateDate: Date = new Date();
  loaded!: boolean;
  isActive: boolean = false;
  datesRange: any = { firstSelect: '', lastSelect: '' };
  calendarHead: any;
  message: string = '';

  constructor(
    private customDate: CustomDatePipe,
    private userService: UsersService,
    private entriesService: EntriesService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.user = this.userService.selectedUser;
    if (this.user.id) {
      this.getEntries();
    } else {
      this.location.back();
    }

    this.loaded = false;
    document.addEventListener('click', this.onClick.bind(this));
  }

  getEntries() {
    let user: any;
    user = {
      user_id: this.user.id,
    };
    if (this.datesRange.firstSelect) {
      user.start_time = new Date(this.datesRange.firstSelect);
      user.end_time = new Date(this.datesRange.lastSelect);
    }

    this.entriesService
      .getAllEntries(user)
      .subscribe(({ entries, suspicious }) => {
        this.reviewEntries = suspicious;
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

  public deleteEntry(id: number) {
    this.entriesService.deleteEntry(id).subscribe((v) => {
      this.message = 'Entry deleted!';
      this.store.addNotifications(this.message);
      this.getEntries();
    });
  }

  public authorizeEntry(entry: any) {
    this.entriesService.updateEntry(entry.id, entry).subscribe({
      next: () => {
        this.message = 'Entry confirmed!';
        this.store.addNotifications(this.message);
        this.getEntries();
      },
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
