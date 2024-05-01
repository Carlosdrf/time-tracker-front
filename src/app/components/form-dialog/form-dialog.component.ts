import { Component, OnInit } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { AsyncPipe } from '@angular/common';

import { MatInputModule } from '@angular/material/input';
import { TimezoneService } from 'src/app/services/timezone.service';
import { CommonModule } from '@angular/common';

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
  ],
  templateUrl: './form-dialog.component.html',
  styleUrl: './form-dialog.component.scss',
})
export class FormDialogComponent implements OnInit {
  public companyForm = [
    {
      title: 'Name',
      label: 'Company Name',
      type: 'text',
      value: '',
    },
    {
      title: 'Description',
      label: 'Short description (optional)',
      type: 'text',
      value: '',
    },
    {
      title: 'Timezone',
      label: 'Select a timezone',
      type: 'select',
      value: '',
    },
  ];
  timezones: any = [];
  timezoneList = [];
  constructor(private timezoneService: TimezoneService) {}
  ngOnInit(): void {
    this.getTimezones();
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
