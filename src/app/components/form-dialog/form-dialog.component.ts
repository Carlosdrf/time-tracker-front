import { Component, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { TimezoneService } from 'src/app/services/timezone.service';
import { CommonModule } from '@angular/common';
import { Timezone } from 'src/app/models/Timezone.model';

@Component({
  selector: 'app-form-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    CommonModule,
    MatSelectModule,
    MatAutocompleteModule,
    AsyncPipe,
    ReactiveFormsModule,
  ],
  templateUrl: './form-dialog.component.html',
  styleUrl: './form-dialog.component.scss',
})
export class FormDialogComponent implements OnInit {
  companyForm: FormGroup;
  constructor(
    private timezoneService: TimezoneService,
    private fb: FormBuilder
  ) {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      timezone: ['', [Validators.required]],
    });
  }
  public companyFields = [
    {
      control: 'name',
      label: 'Company Name',
      type: 'text',
      value: '',
    },
    {
      control: 'description',
      label: 'Short description (optional)',
      type: 'text',
      value: '',
    },
    {
      control: 'timezone',
      label: 'Select a timezone',
      type: 'select',
      value: '',
    },
  ];
  timezones: any = [];
  timezoneList = [];
  validForm: boolean = false;
  ngOnInit(): void {
    this.getTimezones();
    this.companyForm.valueChanges.subscribe({
      next: (form: any) => {
        const validTimezone = this.timezoneList.filter(
          (timezone: Timezone) =>
            `${timezone.zoneName}:${timezone.countryCode}` == form.timezone
        );
        if (this.companyForm.valid && validTimezone.length > 0)
          this.validForm = this.companyForm.valid;
      },
    });
  }

  private getTimezones() {
    this.timezoneService.fetchTimezonesApi().subscribe({
      next: (data: any) => {
        if (data.status === 'OK' && Array.isArray(data.zones)) {
          this.timezoneList = data.zones.map((timezone: any) => {
            timezone.fechaActual =
              this.timezoneService.convertTimezone(timezone);
            return timezone;
          });
        } else {
          console.error('Error: Invalid data structure');
        }
        this.timezones = this.timezoneList;
      },
    });
  }

  public search(value: string) {
    const filter = value.toLowerCase();
    this.timezones = this.timezoneList.filter((timezone: any) =>
      timezone.zoneName.toLowerCase().includes(filter)
    );
  }
}
