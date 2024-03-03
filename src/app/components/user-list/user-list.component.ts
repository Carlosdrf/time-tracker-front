import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChange,
  SimpleChanges,
} from '@angular/core';
import { SharedModule } from '../shared.module';
import { TimerComponent } from '../timer/timer.component';
import { UserOptionsComponent } from '../user-options/user-options.component';
import { UsersService } from 'src/app/services/users.service';
import { EntriesService } from 'src/app/services/entries.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [SharedModule, TimerComponent, UserOptionsComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss',
})
export class UserListComponent implements OnChanges {
  @Input() users!: any;
  @Input() timer: boolean = false;
  @Input() loaded!: boolean;
  @Input() links: any;
  @Output() onSelectedUser: EventEmitter<any> = new EventEmitter<any>();
  @Output() onToggleStatus: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private userService: UsersService,
    private entriesService: EntriesService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['users'].firstChange) {
      console.log(changes);
      this.getEntriesForReview(changes['users'].currentValue);
    }
  }
  setReportInfo(user: any) {
    this.userService.setUserInformation(user);
  }

  selectUser(user: any) {
    this.onSelectedUser.emit(user);
  }

  toggleUserStatus(user: any) {
    this.onToggleStatus.emit(user);
  }

  getEntriesForReview(users: any) {
    let userIds: any[] = [];
    console.log(users);
    users.forEach((user: any) => {
      userIds.push(user.id);
    });
    console.log(userIds);
    this.userService
  }
}
