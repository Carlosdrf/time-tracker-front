import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { ReportFilter, ReportsFilterComponent } from 'src/app/components/reports-filter/reports-filter.component';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import { SharedModule } from 'src/app/components/shared.module';
import { CustomDatePipe } from 'src/app/services/custom-date.pipe';
import { ReportsService } from 'src/app/services/reports.service';
import { UsersService } from 'src/app/services/users.service';
import { FormBuilder, FormControl, FormGroup, FormsModule } from '@angular/forms';
import { Company } from 'src/app/models/User.model';
import { CompaniesService } from 'src/app/services/companies.service';
import { EntriesService } from 'src/app/services/entries.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-admin.payments-employees',
  templateUrl: './admin.payments-employees.component.html',
  styleUrls: ['./admin.payments-employees.component.scss'],
  standalone: true,
  imports: [SharedModule, ReportsFilterComponent, MatTableModule, MatPaginatorModule, FormsModule] 
})
export class AdminPaymentsEmployeesComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @Output() payments: EventEmitter<any> = new EventEmitter<any>();
  public loaded: boolean = false;
  public searchForm: FormGroup = this.fb.group({
    searchField: [''],
    filter: this.fb.group({
      status: [true],
      role: [2],
    }),
    company: ['all'],
  });


  public users: any = [];
  companies: Company[] = [];
  public company = new FormControl('');
  formGroup: FormGroup;
  filteredUsers: any[] = [];
  selectedStartDate!: Date;
  selectedEndDate!: Date;


  selectedUser: any;
  selectedProject: any;
  entries: any = [];
  filteredEntries: any = [];
  isActive: boolean = false;
  datesSelection: any;
  datesRange: any = { firstSelect: '', lastSelect: '' };
  calendarHead: any;
  totalEntries: any = [];
  user: any = { id: null, name: null, company: null };
  filters: ReportFilter = {
    user: 'all',
    company: 'all',
    project: 'all',
    byClient: false,
    useTimezone: false,
  };

  displayedColumns: string[] = ['index', 'company', 'fullname', 'work_hours', 'hourly_rate', 'payment'];
  dataSource = new MatTableDataSource<any>();

  constructor(
    private userService: UsersService,
    public customDate: CustomDatePipe,
    private companiesService: CompaniesService,
    private entriesService: EntriesService,
    private reportsService: ReportsService,
    private elementRef: ElementRef,
    private fb: FormBuilder
  ) {
    this.formGroup = this.fb.group({
      company: ['all'] // Aquí puedes agregar más controles según sea necesario
    });
  }

  ngOnInit() {
    // this.loaded = false;
    this.getUsers('all');
    this.getCompanies();
  }
  
  // getUsers() {
  //   this.userService.getUsers(this.searchForm.value).subscribe((users) => {
  //       this.users = users.filter((user: any) => user.active !== 0);

  //       this.users.forEach((user: any) => {
  //           this.entriesService.getAllEntries({ user_id: user.id }).subscribe(({ entries }) => {
  //               const startDate = new Date(this.datesRange.firstSelect);
  //               const endDate = new Date(this.datesRange.lastSelect);

  //               const dateArray = this.getDatesArray(startDate, endDate);

  //               const filteredEntries = entries.filter((entry: any) => {
  //                 const entryDate = new Date(entry.start_time);

  //                 // Filtrar por cada fecha en el array dateArray
  //                 return dateArray.some((date) => entryDate.toDateString() === date.toDateString());
  //             });

  //               const totalWorkTime = filteredEntries.reduce((acc: number, entry: any) => {
  //                   const start = new Date(entry.start_time);
  //                   const end = new Date(entry.end_time);
  //                   const duration = end.getTime() - start.getTime();
  //                   return acc + duration;
  //               }, 0);

  //               const totalHours = totalWorkTime / (1000 * 60 * 60);

  //               user.total_hours = this.formatMilliseconds(totalWorkTime);
  //               const hourlyRate = user.employee.hourly_rate;
  //               user.payment = totalHours * hourlyRate;

  //               this.dataSource.data = this.users;
  //               this.dataSource.paginator = this.paginator;
  //           });
  //       });
  //   });
  // }

  getUsers(event: any) {
    let selectedCompany = this.searchForm.get('company')!.value;
    this.userService.getUsers(this.searchForm.value).subscribe((users) => {
      this.users = users.filter((user: any) => user.active !== 0)
        if (selectedCompany === 'all') {
          this.users = users.filter((user: any) => user.active !== 0);
        } else {
          this.users = this.users.filter((user: any) => user.employee.id === selectedCompany.id);
        }

        this.users.forEach((user: any) => {
            this.entriesService.getAllEntries({ user_id: user.id }).subscribe(({ entries }) => {
                const startDate = new Date(this.datesRange.firstSelect);
                const endDate = new Date(this.datesRange.lastSelect);

                const dateArray = this.getDatesArray(startDate, endDate);

                const filteredEntries = entries.filter((entry: any) => {
                  const entryDate = new Date(entry.start_time);

                  // Filtrar por cada fecha en el array dateArray
                  return dateArray.some((date) => entryDate.toDateString() === date.toDateString());
              });

                const totalWorkTime = filteredEntries.reduce((acc: number, entry: any) => {
                    const start = new Date(entry.start_time);
                    const end = new Date(entry.end_time);
                    const duration = end.getTime() - start.getTime();
                    return acc + duration;
                }, 0);

                const totalHours = totalWorkTime / (1000 * 60 * 60);

                user.total_hours = this.formatMilliseconds(totalWorkTime);
                const hourlyRate = user.employee.hourly_rate;
                user.payment = totalHours * hourlyRate;

                this.dataSource.data = this.users;
                this.dataSource.paginator = this.paginator;
            });
        });
    });
  }

getDatesArray(startDate: Date, endDate: Date): Date[] {
  const dateArray = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
  }

  return dateArray;
}

  formatMilliseconds(milliseconds: number): string {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    return `${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}`;
  }

  getCompanies() {
    this.companiesService.getCompanies().subscribe({
      next: (companies: Company[]) => {
        this.companies = companies;
      },
    });
  }
  
  handleSelection(event: any) {
    const selectedValue = event.value;
    if (selectedValue === 'all') {
      this.dataSource.data = this.users;
    } else {
      this.dataSource.data = this.users.filter((user: any) => user.employee.company === selectedValue.name);
    }
  }

  // getTotalHours(start: Date, end: Date) {
  //   const [startformat, endformat] = [new Date(start), new Date(end)];
  //   const starts = startformat.getTime();
  //   const ends = endformat.getTime();
  //   const difference = ends - starts;
  //   const hours = Math.floor(difference / 1000 / 60 / 60);
  //   const minutes = Math.floor((difference / 1000 / 60) % 60);
  //   const seconds = Math.floor((difference / 1000) % 60);
  //   return (
  //     this.padZero(hours) +
  //     ':' +
  //     this.padZero(minutes) +
  //     ':' +
  //     this.padZero(seconds)
  //   );
  // }

  padZero(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  public toggleCalendar() {
    this.isActive = !this.isActive;
  }
  setDatesGroup(dateRange: any) {
    this.toggleCalendar();
  }
  resetDates() {
    this.datesRange.firstSelect = '';
    this.datesRange.lastSelect = '';
    // this.getUsers();
  }
}

