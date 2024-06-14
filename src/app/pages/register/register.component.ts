import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Loader } from 'src/app/app.models';
import { WebNavComponent } from 'src/app/components/web-nav/web-nav.component';
import { CompaniesService } from 'src/app/services/companies.service';
import { environment } from 'src/environments/environment';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { UsersService } from 'src/app/services/users.service';
import { NotificationStore } from 'src/app/stores/notification.store';
import { NotificationModalComponent } from 'src/app/components/notification-modal/notification-modal.component';

export interface CustomFields {
  label: string;
  type: string;
  control: string;
  options?: string[];
}
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [WebNavComponent, RegisterFormComponent, NotificationModalComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  notificationStore = inject(NotificationStore);
  constructor(
    private fb: FormBuilder,
    private companieService: CompaniesService,
    private employeeService: UsersService,
    private route: ActivatedRoute
  ) {}
  register: FormGroup = this.fb.group({
    client: this.fb.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      company: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      positions: ['', [Validators.required]],
      tasks_description: [''],
    }),
    teamMember: this.fb.group({
      name: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      englishLevel: ['', [Validators.required]],
      resume: ['', [Validators.required]],
    }),
  });
  loader: Loader = new Loader(false, false, false);
  formStatus: any = { isInvalid: false, message: '' };

  formFields: CustomFields[] = [
    {
      label: 'Your name',
      type: 'text',
      control: 'name',
    },
    {
      label: 'Your lastname',
      type: 'text',
      control: 'lastname',
    },
    {
      label: 'Company Name',
      type: 'text',
      control: 'company',
    },
    {
      label: 'Email Address',
      type: 'text',
      control: 'email',
    },
    {
      label: 'Phone',
      type: 'text',
      control: 'phone',
    },
    {
      label: 'Select the worker you need',
      type: 'select',
      control: 'positions',
      options: ['Legal Assistant', 'Virtual Receptionist'],
    },
    {
      label: 'Describe the tasks you need help with (optional)',
      type: 'text',
      control: 'tasks_description',
    },
  ];
  formType!: FormGroup<any>;
  routeType!: string;
  ngOnInit(): void {
    this.route.url.subscribe((route) => {
      this.routeType = route[1].path;
      switch (this.routeType) {
        case 'client':
          this.formType = this.register.get('client') as FormGroup;
          break;
        case 'tm':
          this.formType = this.register.controls['teamMember'] as FormGroup;
          break;
      }
      this.generateFields();
    });
  }

  handleSubmit(formData: FormGroup) {
    const service =
      this.routeType == 'client' ? this.companieService : this.employeeService;
    service.createPossible(formData.value).subscribe({
      next: (response: any) => {
        this.formStatus.message = 'Your information was sent succesfully';
        this.notificationStore.addNotifications(
          this.formStatus.message,
          'success'
        );
        this.loader.complete = true;
        let urlExtension =
          this.routeType == 'client' ? `welcome-client` : `welcome-tm`;
        setTimeout(() => {
          window.location.href = `${environment.baseWP}/${urlExtension}`;
        }, 3000);
      },
      error: (e) => {
        this.formStatus = {
          isInvalid: true,
          message: "There's been an error, try again later..",
        };
        if (e.status == 409) this.formStatus.message = e.error.errorMessage;

        this.notificationStore.addNotifications(
          this.formStatus.message,
          'error'
        );
      },
    });
  }

  generateFields() {
    if (this.routeType == 'tm')
      this.formFields = [
        {
          label: 'Name',
          type: 'text',
          control: 'name',
        },
        {
          label: 'Last Name',
          type: 'text',
          control: 'lastname',
        },
        { label: 'Email Address', type: 'text', control: 'email' },
        { label: 'Phone Number', type: 'text', control: 'phone' },
        {
          label: 'English Level',
          type: 'select',
          control: 'englishLevel',
          options: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'],
        },
        { label: 'Add your Resume', type: 'file', control: 'resume' },
      ];
  }
}
