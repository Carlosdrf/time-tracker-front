import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { ModalComponent } from 'src/app/components/confirmation-modal/modal.component';
import { SharedModule } from 'src/app/components/shared.module';
import { Company } from 'src/app/models/User.model';
import { CompaniesService } from 'src/app/services/companies.service';
import { PositionsService } from 'src/app/services/positions.service';
import { ProjectsService } from 'src/app/services/projects.service';
import { TimezoneService } from 'src/app/services/timezone.service';
import { Project } from 'src/app/models/Project.model';
import { NotificationStore } from 'src/app/stores/notification.store';

@Component({
  selector: 'app-admin.management',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './admin.management.component.html',
  styleUrl: './admin.management.component.scss',
})
export class AdminManagementComponent implements OnInit {
  store = inject(NotificationStore);
  managementForm: FormGroup = this.fb.group({
    position: this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
    }),
    company: this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      timezone: [''],
      // active: ['', [Validators.required]],
    }),
    project: this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      company_id: ['', [Validators.required]],
      employees: this.fb.array([]),
    }),
  });
  show: boolean = false;
  timezones: any = '';
  companies: any = [];
  formHeader: any = {
    mode: 'Create',
    title: 'Positions',
  };
  firefox: boolean = false;
  selectedForm: any;
  isAllSelected: boolean = false;
  public newOptions: any = {
    positions: {
      title: 'Positions',
    },
    companies: {
      title: 'Companies',
    },
    projects: {
      title: 'Projects',
    },
  };

  public options: any = [
    {
      title: 'Positions',
      label: 'Set the employees positions',
      active: true,
      formGroup: 'position',
      form: [
        { name: 'title', type: 'text' },
        { name: 'description', type: 'text' },
      ],
      elements: [],
      method: this.positionService,
    },
    {
      title: 'Companies',
      label: 'Create/Edit companies info',
      active: false,
      formGroup: 'company',
      form: [
        { name: 'name', type: 'text' },
        { name: 'description', type: 'text' },
        { name: 'timezone', type: 'select', source: this.timezones },
      ],
      elements: [],
      method: this.companiesService,
    },
    {
      title: 'Projects',
      label: 'Create/Edit projects for companies',
      active: false,
      formGroup: 'project',
      form: [
        { name: 'name', type: 'text' },
        { name: 'description', type: 'text' },
        {
          name: 'company_id',
          type: 'select',
          source: [],
        },
        { name: 'employees', source: [], type: 'checkbox' },
      ],
      elements: [],
      method: this.projectService,
      filterBy: [],
    },
  ];

  constructor(
    private fb: FormBuilder,
    private companiesService: CompaniesService,
    private positionService: PositionsService,
    private projectService: ProjectsService,
    private timezoneService: TimezoneService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    if (window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
      this.firefox = true;
    }
    this.getCompanies();
    this.getOptionsInfo();
    this.getTimezones();

    this.managementForm
      .get('project')
      ?.get('company_id')
      ?.valueChanges.subscribe((company: any) => {
        this.isAllSelected = false;
        if (company) {
          this.getEmployees(company);
        } else {
          (
            this.managementForm.get('project')?.get('employees') as FormArray
          ).clear();
        }
      });

    this.options.forEach((option: any) => {
      let formGroup = this.managementForm.get(option.formGroup) as FormGroup;
      option.form.forEach((form: any) => {
        for (let control in formGroup.controls) {
          if (form.name == control) {
            form.label =
              control.slice(0, 1).toUpperCase() +
              control.slice(1).replace('_id', '');
            form.control = control;
          }
        }
      });
    });
  }

  selectAll(option: any, form: any, target: any) {
    const checkboxes = this.managementForm
      .get(option.formGroup)
      ?.get(form.control) as FormArray;
    // checkboxes.clear();

    checkboxes.value.forEach((employee: any, i: number) => {
      checkboxes.get(`${i}`)?.patchValue({
        id: employee.id,
        checked: target.checked,
        user_id: employee.user_id,
        name: `${employee.name}`,
      });
    });
    this.isAllSelected = !this.isAllSelected;
  }
  handleFilter(target: any, option: any) {
    this.resetForm();
    this.projectService.get().subscribe({
      next: (projects: Project[]) => {
        option.elements =
          target.value == '-1'
            ? projects
            : projects.filter(
                (project: Project) => project.company_id == target.value
              );
      },
    });
  }
  getEmployees(id: string) {
    this.companiesService.getEmployees(id).subscribe({
      next: (employees: any) => {
        this.options.forEach((option: any) => {
          option.form.forEach((form: any) => {
            if (form.name == 'employees') {
              const employeeArray = this.managementForm
                .get(option.formGroup)
                ?.get(form.control) as FormArray;
              employeeArray.clear();
              let assignedUsers: any = [];
              if (this.selectedForm && this.selectedForm.users) {
                assignedUsers = this.selectedForm.users
                  .map((user: any) => user.id)
                  .flat();
              }
              employees.forEach((employee: any) => {
                employeeArray.push(
                  this.fb.group({
                    id: employee.id,
                    checked:
                      this.selectedForm &&
                      this.selectedForm.users &&
                      assignedUsers.indexOf(employee.user_id) != '-1'
                        ? true
                        : false,
                    user_id: employee.user_id,
                    name: `${employee.user.name} ${employee.user.last_name}`,
                  })
                );
              });
            }
          });
        });
      },
    });
  }

  toggleSelectEmployee(i: number, option: any, form: any, target: any) {
    this.managementForm
      .get(option.formGroup)
      ?.get(form.control)
      ?.get(`${i}`)
      ?.patchValue({ checked: target.checked });
  }
  getTimezones() {
    this.timezoneService.fetchTimezonesApi().subscribe((data: any) => {
      if (data.status === 'OK' && Array.isArray(data.zones)) {
        this.timezones = data.zones.map((timezone: any) => {
          const fechaActual = this.timezoneService.convertTimezone(timezone);
          timezone.id = `${timezone.zoneName}:${timezone.countryCode}`;
          timezone.name = `${fechaActual} ${timezone.zoneName}`;
          return timezone;
        });
        this.options.forEach((option: any) => {
          option.form.forEach((element: any) => {
            if (element.name == 'timezone') element.source = this.timezones;
          });
        });
      } else {
        console.error('Error: Invalid data structure');
      }
    });
  }
  getCompanies() {
    this.companiesService.getCompanies().subscribe({
      next: (companies: Company[]) => {
        this.companies = companies;
        this.options.forEach((option: any) => {
          option.form.forEach((element: any) => {
            if (element.name == 'company_id') element.source = this.companies;
          });
          if (option.filterBy) option.filterBy = this.companies;
        });
      },
    });
  }
  handleSelection(
    i: number,
    selectedOption: any = null,
    selection: any = null
  ) {
    // const active = selectedOption && selectedOption.active ? false : true;
    if (selectedOption && !selectedOption.active) {
      this.resetForm();
    }
    this.options.forEach((option: any, index: number) => {
      option.elements.forEach((element: any) => {
        if (selection == element) {
          this.fillForm(option, selection);
          this.show = true;
        }
      });

      if (index != i) {
        option.active = false;
      } else {
        option.active = true;
        this.formHeader.title = option.title;
      }
    });
    this.formHeader.mode = this.selectedForm ? 'Edit' : 'Create';
    // if(selectedOption) selectedOption.active = active
  }

  fillForm(option: any, select: any) {
    this.managementForm.reset();
    if (this.selectedForm == select) {
      this.selectedForm = null;
      return;
    }
    if (this.selectedForm != select) {
      this.managementForm.get(option.formGroup)?.patchValue(select);
      this.selectedForm = select;
    }
  }

  resetForm(open: boolean = false) {
    this.selectedForm = null;
    this.managementForm.reset();
    this.formHeader.mode = 'Create';
    if (this.managementForm.get('project')?.get('company_id'))
      this.managementForm.get('project')?.get('company_id')?.setValue('');
    if (this.managementForm.get('company')?.get('timezone'))
      this.managementForm.get('company')?.get('timezone')?.setValue('');
    if (open) {
      this.show = true;
    }
  }
  getOptionsInfo() {
    forkJoin([
      this.positionService.get(),
      this.companiesService.getCompanies(),
      this.projectService.get(),
    ]).subscribe({
      next: (selectsInfo) => {
        this.options.forEach((option: any, i: number) => {
          option.elements = selectsInfo[i];
        });
      },
    });
  }

  sendForms(option: any) {
    if (this.managementForm.get(option.formGroup)?.valid) {
      option.method
        .submit(
          this.managementForm.get(option.formGroup)?.value,
          this.selectedForm ? this.selectedForm.id : null
        )
        .subscribe({
          next: (response: any) => {
            this.store.addNotifications('Saved Successfully!', 'success');
            if (!this.selectedForm) {
              option.elements.push(response);

              this.resetForm();
              return;
            }
            option.elements = option.elements.map((item: any) => {
              if (item.id == response.id) {
                item = response;
                this.selectedForm = response;
              }
              return item;
            });
          },
          error: (err: ErrorEvent) => {
            const { error } = err;
            this.store.addNotifications(error.message, 'error');
          },
        });
    } else {
      this.store.addNotifications('Fill the required fields');
    }
  }
  deleteOption(id: number, option: any) {
    const dialog = this.dialog.open(ModalComponent, {
      data: { subject: option.formGroup },
    });
    dialog.afterClosed().subscribe((modal: boolean) => {
      if (modal) {
        option.method.delete(id).subscribe({
          next: () => {
            this.resetForm();
            option.elements = option.elements.filter(
              (option: any) => option.id != id
            );
            this.store.addNotifications('Success Operation');
          },
          error: (err: ErrorEvent) => {
            const { error } = err;
            this.store.addNotifications(error.message, 'error');
          },
        });
      }
    });
  }
  isMobile() {
    if (window.innerWidth <= 576) {
      return true;
    }
    return false;
  }
}
