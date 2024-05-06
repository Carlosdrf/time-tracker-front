import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/components/shared.module';
import { WebNavComponent } from 'src/app/components/web-nav/web-nav.component';
import { CompaniesService } from 'src/app/services/companies.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SharedModule, WebNavComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private companieService: CompaniesService,
    private router: Router
  ) {}
  register: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    lastname: ['', [Validators.required]],
    company: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required]],
    positions: ['', [Validators.required]],
    tasks_description: [''],
  });
  formStatus: any = { isInvalid: false, message: '' };
  fields = [
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

  ngOnInit(): void {}

  handleSubmit() {
    this.formStatus.isInvalid = false;
    if (this.register.valid) {
      this.companieService.createPosibleCompany(this.register.value).subscribe({
        next: (response: any) => {
          console.log(response);
          this.formStatus.message = 'Your information was sent succesfully';
          // this.router.navigateByUrl(`${environment.baseWP}/blank`);
          // window.location.href = `${environment.baseWP}/blank`
        },
        error: (e) => {
          this.formStatus = {
            isInvalid: true,
            message: "There's been an error, try again later..",
          };
        },
      });
    } else {
      this.formStatus = {
        isInvalid: true,
        message: 'Please fill the required Fields.',
      };
    }
    setTimeout(() => {
      this.resetStatus();
    }, 5000);
  }

  resetStatus() {
    this.formStatus.isInvalid = false;
    this.formStatus.message = null;
  }
}
