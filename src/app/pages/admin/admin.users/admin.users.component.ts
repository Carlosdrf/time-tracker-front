import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SearchComponent } from 'src/app/components/search/search.component';
import { SharedModule } from 'src/app/components/shared.module';
import { UserListComponent } from 'src/app/components/user-list/user-list.component';
import { CustomDatePipe } from 'src/app/services/custom-date.pipe';
import { EntriesService } from 'src/app/services/entries.service';

@Component({
  selector: 'app-admin.users',
  standalone: true,
  imports: [SearchComponent, UserListComponent, SharedModule],
  templateUrl: './admin.users.component.html',
  styleUrl: './admin.users.component.scss',
})
export class AdminUsersComponent {
  public loaded: boolean = false;
  public searchForm: FormGroup = new FormGroup({ searchField: new FormControl('') });
  public users: any;
  public links: any = ''

  constructor(
    private entriesService: EntriesService,
    public customDate: CustomDatePipe
  ) {}

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.entriesService.getUsers(this.searchForm.value).subscribe((users) => {
      this.users = users;
      this.loaded = true
    });
  }

  loading() {
    this.users = [];
    this.loaded = false;
  }
}
