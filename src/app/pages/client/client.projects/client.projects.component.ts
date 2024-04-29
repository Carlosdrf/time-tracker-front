import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { SharedModule } from 'src/app/components/shared.module';
import { Company } from 'src/app/models/User.model';
import { CompaniesService } from 'src/app/services/companies.service';
import { PagesComponent } from '../../pages.component';
import { ProjectsService } from 'src/app/services/projects.service';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { UsersService } from 'src/app/services/users.service';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-client.projects',
  standalone: true,
  imports: [SharedModule, MatFormFieldModule, MatSelectModule],
  templateUrl: './client.projects.component.html',
  styleUrl: './client.projects.component.scss',
})
export class ClientProjectsComponent implements OnInit {
  selectedEmployees: any[] = [];
  selectedOptions = new FormControl();
  @ViewChild(MatSelect) matSelect!: MatSelect;
  managementForm: FormGroup = this.fb.group({
    project: this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      company_id: ['', [Validators.required]],
      employees: this.fb.array(this.selectedEmployees)
    }),
  });
  show: boolean = false;
  companies: any = [];
  formHeader: any = {
    mode: 'Create',
    title: 'Projects',
  };
  firefox: boolean = false;
  selectedForm: any;
  employees: any = [];
  userId: number = 0;

  public options: any = [
    {
      title: 'Projects',
      label: 'Create/Edit projects for companies',
      active: true,
      formGroup: 'project',
      form: [
        { name: 'name', type: 'input' },
        { name: 'description', type: 'input' },
        { name: 'company_id', type: 'select', source: this.companies },
        { employees: this.selectedEmployees }
      ],
      elements: [],
      method: this.projectService,
    },
  ];

  constructor(
    private fb: FormBuilder,
    private companiesService: CompaniesService,
    private projectService: ProjectsService,
    private userService: UsersService,
    private dialog: MatDialog,
    private page: PagesComponent,
  ) {}

  ngOnInit() {
    if (window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
      this.firefox = true;
    }
    this.getCompanies();
    this.getOptionsInfo();
    this.getEmployees();

    this.options.forEach((option: any) => {
      let formGroup = this.managementForm.get(option.formGroup) as FormGroup;
      option.form.forEach((form: any) => {
        for (let control in formGroup.controls) {
          if (form.name == control) {
            form[control] = this.managementForm
              .get(option.formGroup)
              ?.get(control)?.value;
            form.label =
              control.slice(0, 1).toUpperCase() +
              control.slice(1).replace('_id', '');
            form.control = control;
          }
        }
      });
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
        });
      },
    });
  }
  getEmployees() {
    this.userService.getEmployees().subscribe({
      next: (employees: any) => {
        this.employees = employees.filter((user: any) => user.user.active == 1);
      },
    });
  }
  handleSelection(
    i: number,
    selectedOption: any = null,
    selection: any = null
  ) {
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
  }

  fillForm(option: any, select: any) {
    this.managementForm.reset();
    this.selectedOptions.reset();
    this.selectedEmployees = [];
    if (this.selectedForm == select) {
      this.selectedForm = null;
      return;
    }
    if (this.selectedForm != select) {
      this.managementForm.get(option.formGroup)?.patchValue(select);
      
      this.selectedForm = select;
      this.selectedEmployees = this.selectedForm.users.map((item:any) => item.id);
      this.selectedOptions.setValue(this.selectedEmployees);
    }
  }

  resetForm(open: boolean = false) {
    this.selectedForm = null;
    this.selectedEmployees = [];
    this.selectedOptions.reset();
    this.managementForm.reset();
    this.formHeader.mode = 'Create';
    this.managementForm.get('project')?.get('employees')?.setValue([]);
    if (this.managementForm.get('project')?.get('company_id'))
      this.managementForm.get('project')?.get('company_id')?.setValue('');
    if (open) {
      this.show = true;
    }
  }
  getOptionsInfo() {
    forkJoin([
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
      const formValue = this.managementForm.get(option.formGroup)?.value
      const selectedEmployees = this.selectedEmployees.filter(employee => employee.checked);
      const deselectedEmployees = this.selectedEmployees.filter(employee => !employee.checked);
      formValue.employees = selectedEmployees.map(employee => ({
        user_id: employee.user_id,
        checked: true
      })).concat(deselectedEmployees.map(employee => ({
        user_id: employee.user_id,
        checked: false
      })));
      option.method
        .submit(
          formValue,
          this.selectedForm ? this.selectedForm.id : null
        )
        .subscribe({
          next: (response: any) => {
            if (!this.selectedForm) {
              option.elements.push(response);
              this.page.setAlert("Project Created Successfully");
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
            this.page.setAlert(error.message);
          },
        });
    }else{
      this.page.setAlert("Fill the required fields")
    }
  }

  onEmployeeSelectionChange(selectedEmployeeIds: number[]): void {
    this.selectedEmployees = this.employees.map((item:any) => ({
      user_id: item.user.id,
      checked: selectedEmployeeIds.includes(item.user.id)
    }));
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
