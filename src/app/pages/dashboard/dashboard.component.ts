import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { EntriesService } from '../../services/entries.service';
import { CustomDatePipe } from '../../services/custom-date.pipe';
import { PagesComponent } from '../pages.component';
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
  entryCheck: boolean = false;
  currentEntryId: number = 0;
  timer: any = '00:00:00';
  message: any;
  start_time: any;

  constructor(
    private socketService: WebSocketService,
    private entriesService: EntriesService,
    public customDate: CustomDatePipe,
    private page: PagesComponent
  ) {}

  ngOnInit() {
    this.getEntries();
    this.socketService.socket?.on('server:start_timer', (data) => {
      if (data.length !== 0) {
        this.currentEntryId = data.id;
        this.start_time = new Date();
        this.entryCheck = true;
      } else {
        this.entryCheck = false;
      }
    });
    this.socketService.socket.on('server:getEntries', (data) => {
      this.entries = data;
    });
    this.socketService.socket.on('server:end_entry', () => {
      this.getEntries();
    });
  }
  getEntries() {
    this.entriesService.getEntries().subscribe((result) => {
      this.entries = result.filter((entry: any) => entry.status !== 0);
      const startedEntry = result.filter((entry: any) => entry.status === 0);
      if (startedEntry.length !== 0) {
        this.currentEntryId = startedEntry[0].id;
        this.start_time = startedEntry[0].start_time;
        this.entryCheck = true;
      } else {
        this.entryCheck = false;
      }

      this.loaded = true;
    });
  }
  getEntryStatus() {
    this.entriesService.getEntryCheck().subscribe((res) => {
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
    this.entriesService.createEntry(data).subscribe((startedEntry: any) => {
      this.currentEntryId = startedEntry.id;
      this.start_time = new Date();
      this.entryCheck = true;
      this.message = 'Entry Started Successfully';
      this.page.setAlert(this.message);
      this.socketService.socket.emit('client:start_timer', startedEntry);
      this.socketService.socket.emit('client:loadEntries', this.entries);
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
        this.socketService.socket.emit('client:end_entry', 'mensaje');
      });
  }

  deleteEntry(id: number) {
    this.entriesService.deleteEntry(id).subscribe((v) => {
      this.getEntries();
      this.message = 'Entry deleted!';
      this.page.setAlert(this.message);
    });
  }
}
