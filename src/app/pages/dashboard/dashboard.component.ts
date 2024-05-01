import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { EntriesService } from '../../services/entries.service';
import { CustomDatePipe } from '../../services/custom-date.pipe';
import { PagesComponent } from '../pages.component';
import { WebSocketService } from 'src/app/services/socket/web-socket.service';
import { Entries } from 'src/app/models/Entries';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class EmployeeDashboardComponent implements OnInit {
  @Output() getAlert: EventEmitter<any> = new EventEmitter<any>();
  entriesAlert: string = '';
  name: any;
  entries: any = [];
  loaded!: boolean;
  entryCheck: boolean = false;
  currentEntryId: number = 0;
  timer: any = '00:00:00';
  message: any;
  start_time: any;
  startedEntry: Entries = {
    status: 0,
    description: '',
    start_time: new Date(),
    end_time: new Date(),
  };
  public components: Array<any> = [
    {
      href: null,
      path: '/entries',
      resource: 'entries-section.png',
      title: 'Tracker',
      description: 'You can see your entries',
      header: 'See your Entries',
      alert: true,
      options: [],
    },
    {
      path: '/reports',
      href: null,
      resource: 'reports-section.png',
      title: 'Report Section',
      description: 'You can see and download your entries',
      header: 'Go to Reports',
      options: [],
    },
    {
      path: '/employees/customer-service',
      href: null,
      resource: 'customer-service-section.png',
      title: 'Customer Service',
      description: 'Here you can talk to an agent or create a ticket',
      header: 'Customer Service',
      options: [],
    },
    {
      component: '',
      path: null,
      href: 'https://i-nimble.com/blog/',
      resource: 'blog-section.png',
      title: 'Blog Section',
      description: 'Go to I-nimble blog and get our last News',
      header: 'See News',
      options: [],
    },
  ];
  constructor(
    private socketService: WebSocketService,
    private entriesService: EntriesService,
    public customDate: CustomDatePipe,
    private page: PagesComponent
  ) {}

  ngOnInit() {
    this.name = this.getUserName();
    this.getEntries();
    this.socketService.socket?.on('server:start_timer', (data) => {
      if (data.length !== 0) {
        this.currentEntryId = data.id;
        this.start_time = new Date();
        this.startedEntry = data;
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
  getUserName() {
    const name = localStorage.getItem('name');
    return name;
  }

  getEntries() {
    this.entriesService.getEntries().subscribe(({ entries, suspicious }) => {
      if (suspicious.length > 0)
        this.entriesAlert =
          'You have some entries for review, you should talk to HR';
      this.entries = entries.filter((entry: any) => entry.status !== 0);
      const startedEntry = entries.filter((entry: any) => entry.status === 0);
      if (startedEntry.length !== 0) {
        this.currentEntryId = startedEntry[0].id;
        this.start_time = startedEntry[0].start_time;
        this.startedEntry = startedEntry[0];
        this.entryCheck = true;
      } else {
        this.entryCheck = false;
      }
      this.loaded = true;
    });
  }

  addEntry(data: any) {
    this.entriesService.createEntry(data).subscribe((startedEntry: any) => {
      this.currentEntryId = startedEntry.id;
      this.startedEntry = startedEntry;
      this.start_time = new Date();
      this.entryCheck = true;
      this.message = 'Entry Started Successfully';
      this.page.setAlert(this.message);
      this.socketService.socket.emit('client:start_timer', startedEntry);
      this.socketService.socket.emit('client:loadEntries', this.entries);
    });
  }
  endCurrentEntry(currentEntry: any) {
    this.currentEntryId = currentEntry.id;
    this.entriesService.closeCurrentEntry(currentEntry).subscribe((v) => {
      this.getEntries();
      this.message = 'Entry Ended Successfully';
      this.page.setAlert(this.message);
      this.socketService.socket.emit('client:end_entry', 'mensaje');
    });
  }

  displayAlert(component: any) {
    switch (component.title) {
      case 'Tracker':
        return this.entriesAlert;
        break;
      default:
        return '';
        break;
    }

  }
}
