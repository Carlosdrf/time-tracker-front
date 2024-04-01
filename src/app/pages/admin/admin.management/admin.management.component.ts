import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import { ModalComponent } from 'src/app/components/modal/modal.component';
import { SharedModule } from 'src/app/components/shared.module';
import { Positions } from 'src/app/models/Position.model';
import { Company } from 'src/app/models/User.model';
import { CompaniesService } from 'src/app/services/companies.service';
import { PositionsService } from 'src/app/services/positions.service';
import { PagesComponent } from '../../pages.component';

@Component({
  selector: 'app-admin.management',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './admin.management.component.html',
  styleUrl: './admin.management.component.scss',
})
export class AdminManagementComponent implements OnInit {
  managementForm: FormGroup = this.fb.group({
    position: this.fb.group({
      title: ['', [Validators.required]],
      description: [''],
    }),
    company: this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      // active: ['', [Validators.required]],
    }),
  });
  show: boolean = false;
  public options: any = [
    {
      title: 'Positions',
      label: 'Set the employees positions',
      active: true,
      formGroup: 'position',
      form: [],
      select: [],
      method: this.positionService,
    },
    {
      title: 'Companies',
      label: 'Create/Edit companies info',
      active: false,
      formGroup: 'company',
      form: [],
      select: [],
      method: this.companiesService,
    },
  ];
  formHeader: any = {
    mode: 'Create',
    title: 'Positions',
  };
  firefox: boolean = false;
  selectedForm: any;
  constructor(
    private fb: FormBuilder,
    private companiesService: CompaniesService,
    private positionService: PositionsService,
    private dialog: MatDialog,
    private page: PagesComponent
  ) {}

  ngOnInit(): void {
    if (window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
      this.firefox = true;
    }
    this.options.forEach((option: any) => {
      let formGroup = this.managementForm.get(option.formGroup) as FormGroup;
      for (let control in formGroup.controls) {
        option.form.push({
          [control]: this.managementForm.get(option.formGroup)?.get(control)
            ?.value,
          label: control.slice(0, 1).toUpperCase() + control.slice(1),
          active: false,
          control,
        });
      }
    });

    this.getOptionsInfo();
  }

  handleSelection(i: number, selection: any = null) {
    this.options.forEach((option: any, index: number) => {
      option.select.forEach((select: any) => {
        if (selection == select) {
          this.fillForm(option, selection);
          this.show = true;
        }
      });

      if (index != i) {
        option.active = false;
        if (!selection) {
          this.resetForm();
        }
      } else {
        option.active = true;
        this.formHeader.title = option.title;
      }
    });

    this.formHeader.mode = this.selectedForm ? 'Edit' : 'Create';
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
    if (open) {
      this.show = true;
    }
  }
  getOptionsInfo() {
    forkJoin([
      this.positionService.get(),
      this.companiesService.getCompanies(),
    ]).subscribe({
      next: (selectsInfo) => {
        this.options.forEach((option: any, i: number) => {
          option.select = selectsInfo[i];
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
            if (!this.selectedForm) {
              option.select.push(response);
              this.selectedForm = response;
              return;
            }
            option.select = option.select.map((item: any) => {
              console.log(item);
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
            this.selectedForm = null;
            option.select = option.select.filter(
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
