import { Component, OnInit } from '@angular/core';
import { EntriesService } from '../../../services/entries.service';
import { CustomDatePipe } from '../../../services/custom-date.pipe';
import { Entries } from '../../../models/Entries';
import { FormControl, FormGroup } from '@angular/forms';
import { UserListComponent } from 'src/app/components/user-list/user-list.component';
import { SharedModule } from 'src/app/components/shared.module';
import { TimerComponent } from 'src/app/components/timer/timer.component';
import { SearchComponent } from 'src/app/components/search/search.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [UserListComponent, SharedModule, TimerComponent, SearchComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class AdminDashboardComponent implements OnInit {
  public loaded: boolean = false;
  public searchForm: FormGroup = new FormGroup({ searchField: new FormControl('') });
  public users: any = [];
  public links: any = [{url: '/user/entries', title: 'Entries'}, {url: '/reports', title: 'Reports'}]


  constructor(
    private entriesService: EntriesService,
    public customDate: CustomDatePipe,
  ) {}

  ngOnInit() {
    this.loaded = false;
    this.getUsers();
  }

  getUsers() {
    this.entriesService.getUsers(this.searchForm.value).subscribe((users) => {
      this.users = users;
      this.loaded = true;
    });
  }

  loading() {
    this.loaded = false;
    this.users = [];
  }

  public getName() {
    const name = localStorage.getItem('name');
    return name;
  }
}
