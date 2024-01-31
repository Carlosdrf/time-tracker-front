import {
  Component,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  OnInit,
} from '@angular/core';
// import { Entries } from 'src/app/models/Entries';
import { EntriesService } from '../../services/entries.service';
import { CustomDatePipe } from '../../services/custom-date.pipe';
import { PagesComponent } from '../pages.component';
import * as moment from 'moment';
import { WebSocketService } from 'src/app/services/socket/web-socket.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @Output() getAlert: EventEmitter<any> = new EventEmitter<any>();
  entries: any = [];
  loaded!: boolean;
  entryCheck?: boolean;
  currentEntryId: number = 0;
  timer: any = '00:00:00';
  message: any;
  start_time: any;

  constructor(
    private socketService: WebSocketService,
    private entriesService: EntriesService,
    public customDate: CustomDatePipe,
    private cdRef: ChangeDetectorRef,
    private page: PagesComponent
  ) {}

  ngOnInit() {
    // this.getEntryStatus()
    // const email = localStorage.getItem('email')
    this.getEntries();
    this.socketService.socket?.on('server:timer', (data) => {
      if (data.length !== 0) {
        this.currentEntryId = data[0].id;
        this.start_time = data[0].start_time;
        this.entryCheck = true;
      } else {
        this.entryCheck = false;
      }
      // this.entryCheck = true
    });
    this.socketService.socket.on('server:getEntries', (data) => {
      this.entries = data;
    });
    // this.getName();
  }
  getEntries() {
    this.entriesService.getEntries().subscribe((v) => {
      this.entries = v.result.filter((entry: any) => entry.status !== 0);
      const startedEntry = v.result.filter((entry: any) => entry.status === 0);
      if (startedEntry.length !== 0) {
        this.currentEntryId = startedEntry[0].id;
        this.start_time = startedEntry[0].start_time;
        this.entryCheck = true;
      } else {
        this.entryCheck = false;
      }
      this.socketService.socket.emit('client:timer', startedEntry);
      this.socketService.socket.emit('client:loadEntries', this.entries);
      if (v.token !== null) {
        localStorage.setItem('jwt', v.token);
      }
      this.loaded = true;
    });
  }
  getEntryStatus() {
    this.entriesService.getEntryCheck().subscribe((res) => {
      console.log('?');

      const status = res as Array<any>;
      if (status.length > 0) {
        this.currentEntryId = status[0].id;
        this.start_time = status[0].start_time;
        this.entryCheck = true;
      } else {
        this.entryCheck = false;
      }
    });
  }
  addEntry(data: any) {
    this.entriesService.createEntry(data).subscribe((v) => {
      // this.currentEntryId = v as number
      // this.entryCheck = true
      // this.start_time = moment()
      this.getEntries();
      this.message = 'Entry Started Successfully';
      this.page.setAlert(this.message);
    });
  }
  endCurrentEntry(currentEntryId: any) {
    this.currentEntryId = currentEntryId;
    this.entriesService
      .closeCurrentEntry(this.currentEntryId)
      .subscribe((v) => {
        this.getEntries();
        this.message = 'Entry Ended Successfully';
        this.page.setAlert(this.message);
      });
  }
}
