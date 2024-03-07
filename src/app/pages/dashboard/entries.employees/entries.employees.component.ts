import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { userRoles } from 'src/app/app.models';
import { SearchComponent } from 'src/app/components/search/search.component';
import { SharedModule } from 'src/app/components/shared.module';
import { TimerComponent } from 'src/app/components/timer/timer.component';
import { UserListComponent } from 'src/app/components/user-list/user-list.component';
import { CustomDatePipe } from 'src/app/services/custom-date.pipe';
import { EntriesService } from 'src/app/services/entries.service';
import { WebSocketService } from 'src/app/services/socket/web-socket.service';
import { UsersService } from 'src/app/services/users.service';
import { PagesComponent } from '../../pages.component';
import { EntriesComponent } from 'src/app/components/entries/entries.component';
import { Entries } from 'src/app/models/Entries';

@Component({
  selector: 'app-entries-employees',
  standalone: true,
  imports: [
    UserListComponent,
    SharedModule,
    TimerComponent,
    SearchComponent,
    EntriesComponent,
  ],
  templateUrl: './entries.employees.component.html',
  styleUrls: ['./entries.employees.component.scss'],
})
export class EntriesEmployeesComponent implements OnInit {
  @Output() getAlert: EventEmitter<any> = new EventEmitter<any>();
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
    this.entriesService.getEntries().subscribe(({ entries }) => {
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
    this.entriesService
      .closeCurrentEntry(currentEntry)
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
