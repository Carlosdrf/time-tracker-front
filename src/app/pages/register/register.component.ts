import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SharedModule } from 'src/app/components/shared.module';
import { WebNavComponent } from 'src/app/components/web-nav/web-nav.component';
import { CompaniesService } from 'src/app/services/companies.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SharedModule, WebNavComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  register: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    company: ['', [Validators.required]],
    email: ['', [Validators.required]],
    phone: ['', [Validators.required]],
    positions: ['', [Validators.required]],
    tasks_description: [''],
  });
  fields = [
    {
      label: 'Your name',
      type: 'text',
      control: 'name',
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
  constructor(
    private fb: FormBuilder,
    private companieService: CompaniesService
  ) {}

  ngOnInit(): void {}

  handleSubmit() {
    if (this.register.valid) {
      console.log(this.register);
      console.log(this.register.value);
      this.companieService.createPosibleCompany(this.register.value).subscribe({
        next: (response: any) => {},
      });
    }
  }
}
