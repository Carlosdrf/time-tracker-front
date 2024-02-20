import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Entries } from '../../models/Entries';
import { CustomDatePipe } from '../../services/custom-date.pipe';

@Component({
  selector: 'app-entries-panel',
  templateUrl: './entries-panel.component.html',
  styleUrls: ['./entries-panel.component.scss'],
})
export class EntriesPanelComponent implements OnChanges {
  @Output() start_entry: EventEmitter<any> = new EventEmitter<any>();
  @Output() end_entry: EventEmitter<any> = new EventEmitter<any>();
  @Input() currentEntryId: any;
  @Input() start_time!: Date | null;
  @Input() entryCheck: boolean = false;
  offHours: boolean = false;
  entry: Entries = {
    status: 0,
    task: '',
    start_time: new Date(),
    end_time: new Date(),
  };
  currentTime: any;
  timer: any = '00:00:00';

  constructor(private customDate: CustomDatePipe) {}

  ngOnInit() {
    this.getName();
    document.addEventListener('click', this.toggleMenu.bind(this));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entryCheck']) {
      if (this.entryCheck) {
        this.startTimer(this.start_time);
      }
      if (!this.entryCheck) {
        this.stopTimer();
      }
    }
  }
  addEntry() {
    const data = {
      task: this.entry.task,
      status: this.entry.status,
      start_time: new Date().toUTCString(),
    };

    this.start_entry.emit(data);
    this.entry.task = '';
  }
  endCurrentEntry() {
    this.start_time = new Date();
    this.end_entry.emit(this.currentEntryId);
  }
  public getName() {
    const name = localStorage.getItem('name');
    return name;
  }
  public toggleMenu(event: any) {
    if (!(event.target as HTMLElement).closest('#more-btn')) {
      this.offHours = false;
    } else {
      this.offHours = !this.offHours;
    }
  }
  public startTimer(start_time: any) {
    this.currentTime = setInterval(() => {
      this.timer = this.customDate.getTotalHours(start_time);
    }, 1000);
  }
  public stopTimer() {
    this.timer = '00:00:00';
    clearInterval(this.currentTime);
  }
}
