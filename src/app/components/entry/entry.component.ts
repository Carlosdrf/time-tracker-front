import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SharedModule } from '../shared.module';
import { CustomDatePipe } from 'src/app/services/custom-date.pipe';

@Component({
  selector: 'app-entry',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './entry.component.html',
  styleUrl: './entry.component.scss',
})
export class EntryComponent {
  @Output() onUpdateStartTime: EventEmitter<any> = new EventEmitter<any>();
  @Output() onUpdateEndTime: EventEmitter<any> = new EventEmitter<any>();
  @Output() onUpdateTask: EventEmitter<any> = new EventEmitter<any>();
  @Output() onDeleteEntry: EventEmitter<any> = new EventEmitter<any>()
  @Input() entry: any;
  @Input() suspicious: boolean = false

  constructor(private customDate: CustomDatePipe) {}

  updateStart_time(entry: any, event: Event){
    this.onUpdateStartTime.emit({entry, event})
  }
  updateEnd_time(entry: any, event: Event){
    this.onUpdateEndTime.emit({entry, event})
  }

  updateTask(entry: any, event: any) {
    this.onUpdateTask.emit(entry)
  }

  timeFormat(event: any) {
    event.target.value = event.target.value.replace(/:/g, '');
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

  deleteEntry(id: number) {
    this.onDeleteEntry.emit(id)
  }
}
