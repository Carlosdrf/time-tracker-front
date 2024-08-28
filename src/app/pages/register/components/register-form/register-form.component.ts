import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Loader } from 'src/app/app.models';
import { SharedModule } from 'src/app/components/shared.module';
import { CustomFields } from '../../register.component';
import { NotificationStore } from 'src/app/stores/notification.store';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [NgIf, NgFor, SharedModule],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.scss',
})
export class RegisterFormComponent implements OnInit {
  notificationStore = inject(NotificationStore);
  @Output() onSubmit: EventEmitter<any> = new EventEmitter<any>();
  @Input() registerForm!: FormGroup;
  @Input() fields!: CustomFields[];

  @Input() loader: Loader = new Loader(false, false, false);
  @Input() formStatus: any = { isInvalid: false, message: '' };
  fileName: string = '';
  ngOnInit(): void {}

  handleSubmit() {
    this.loader = new Loader(true, false, false);
    this.formStatus.isInvalid = false;
    if (this.registerForm.valid) {
      this.onSubmit.emit(this.registerForm);
    } else {
      this.formStatus = {
        isInvalid: true,
        message: 'Please fill the required Fields.',
      };
      this.loader.error = true;
      this.notificationStore.addNotifications(this.formStatus.message, 'error');
    }
    setTimeout(() => {
      this.resetStatus();
    }, 3000);
  }

  resetStatus() {
    this.formStatus.isInvalid = false;
    this.formStatus.message = null;
  }

  onFileChange(event: Event) {
    const file = (event.target as HTMLInputElement).files![0];
    this.fileName = file.name
    this.registerForm.get('resume')?.patchValue(file);
  }
}
