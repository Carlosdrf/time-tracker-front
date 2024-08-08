import { NgClass, NgStyle } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SidePanelComponent } from 'src/app/components/side-panel/side-panel.component';
import { UserFormComponent } from 'src/app/components/user-form/user-form.component';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [NgClass, NgStyle, SidePanelComponent, UserFormComponent],
  templateUrl: './create-user.component.html',
  styleUrl: './create-user.component.scss',
})
export class CreateUserComponent {
  router = inject(Router);

  selectedUser: any;

  handleSavedUser(event: any){

  }

  handleDeletedUser(event: any){

  }

  closeFormMobile(event: any){

  }
  closePanel() {
    this.router.navigate(['admin', 'users']);
  }
}
