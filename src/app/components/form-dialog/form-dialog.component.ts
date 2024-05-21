import {
  Component,
  Inject,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TimezoneService } from 'src/app/services/timezone.service';
import { Timezone } from 'src/app/models/Timezone.model';
import { SharedModule } from '../shared.module';

@Component({
  selector: 'app-form-dialog',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './form-dialog.component.html',
  styleUrl: './form-dialog.component.scss',
})
export class FormDialogComponent implements OnInit, OnChanges {
  dialogForm: FormGroup;

  constructor(
    private timezoneService: TimezoneService,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: { type: string }
  ) {
    this.dialogForm = this.fb.group({
      company: this.fb.group({
        name: ['', [Validators.required]],
        description: [''],
        timezone: ['', [Validators.required]],
      }),
      schedule: this.fb.group({
        days: this.fb.array([this.fb.control('')]),
        startTime: ['', [Validators.required]],
        endTime: ['', [Validators.required]],
      }),
    });
  }
  public companyFields: any = [];
  timezones: any = [];
  timezoneList = [];
  validForm: boolean = false;
  daysOfWeekOptions: string[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
  ngOnInit(): void {
    console.log(this.companyFields);

    this.getTimezones();

    this.dialogForm.valueChanges.subscribe({
      next: (form: any) => {
        if (this.data.type == 'company') {
          const validTimezone = this.timezoneList.filter(
            (timezone: Timezone) =>
              `${timezone.zoneName}:${timezone.countryCode}` == form.timezone
          );
          if (this.dialogForm.valid && validTimezone.length > 0)
            this.validForm = this.dialogForm.valid;
        } else {
          if (this.dialogForm.get(this.data.type)?.valid) {
            this.validForm = true;
          }
          console.log(this.dialogForm.get(this.data.type)?.valid);
        }
      },
    });

    if (this.data.type == 'company') {
      this.companyFields = [
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
          type: 'autocomplete',
          value: '',
          source: 'timezones',
        },
      ];
    } else {
      this.companyFields = [
        {
          control: 'days',
          label: 'Select days',
          type: 'select',
          value: '',
          source: 'daysOfWeekOptions',
        },
        {
          control: 'startTime',
          label: 'Start Time',
          type: 'time',
          value: '',
        },
        {
          control: 'endTime',
          label: 'End Time',
          type: 'time',
          value: '',
        },
      ];
    }
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
