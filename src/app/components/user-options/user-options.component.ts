import { Component } from '@angular/core';
import { SharedModule } from '../shared.module';

@Component({
  selector: 'app-user-options',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './user-options.component.html',
  styleUrl: './user-options.component.scss'
})
export class UserOptionsComponent {

}
