/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { GridApi } from 'ag-grid-community';
import { ListService } from 'apps/elicamps/src/services/list.service';
import { LocalstorageService } from 'apps/elicamps/src/services/localstorage.service';
import { ButtonRendererComponent } from 'apps/elicamps/src/ag-grid/renderers/button-renderer.component';
import { DeleteConfirmationDialogComponent } from '../../../common/features/confirmation-dialog/delete-confirmation-dialog.component';
import { Keys, LookupEnum } from 'apps/elicamps/src/common/lookup.enums';

@Component({
  selector: 'app-student-status',
  templateUrl: './student-status.component.html',
  styleUrls: ['./student-status.component.css'],
})
export class StudentStatusComponent implements OnInit {
  public columnDefs: any = [
    {
      name: 'Name',
      field: 'name',
      width: 300,
      editable: true,
    },
    {
      name: 'Description',
      field: 'description',
      editable: true,
    },
  ];
  public gridOptions: any;
  public info!: string;
  private gridApi!: GridApi;
  public StudentStatusList: any;;
  public gridColumnApi: any;
  public fg!: FormGroup;
  public defaultColDef;
  constructor(
    public router: Router,
    public listService: ListService,
    public storage: LocalstorageService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    public fb: FormBuilder,
    public spinner: NgxSpinnerService
  ) {
    this.defaultColDef = {
      resizable: true,
      sortable: true,
      filter: true,
    };
    this.gridOptions = {
      pagination: true,
      paginationAutoPageSize: true,
    };
  }
  ngOnInit() {
    this.fg = this.fb.group({
      name: [''],
      description: [''],
      lookupTableId: [1011],
    });
    this.defaultColDef = {
      resizable: true,
      sortable: true,
      filter: true,
    };
    this.gridOptions = {
      frameworkComponents: {
        buttonRenderer: ButtonRendererComponent,
      },
      pagination: true,
      paginationAutoPageSize: true,
    };
    const buttonRenderer = {
      headerName: '',
      field: 'cancel',
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.openRemoveStudentStatusDialog.bind(this),
      },
      pinned: 'right',
      width: 80,
    };
    this.columnDefs = [...this.columnDefs, buttonRenderer as any];
  }
  openRemoveStudentStatusDialog(student: any): void {
    // tslint:disable-next-line: no-use-before-declare
    this.dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '250px',
      data: { headerName: `${student.rowData.name}` },
    });

    this.dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.deleteStatus(student.rowData);
      }
    });
  }
  public deleteStatus(row: any) {
    this.spinner.show();
    this.listService.DeleteLookupValue(row).subscribe(
      (res) => {
        this.getStudentStatus();
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  public getStudentStatus = () => {
    this.listService.getAll(LookupEnum.STUDENT_STATUS).subscribe((res) => {
      this.StudentStatusList = res;
    });
  };
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getStudentStatus();
  }

  onFilterTextBoxChanged(event: any) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }
  onCellValueChanged(row: any) {
    const model = {
      ...row.data,
      [row.colDef.field]: row.newValue,
    };
    this.listService.UpdateLookupValue(model).subscribe((res) => {
      this.storage.set(Keys.REG_FEE, model.description);
    });
  }
  public openDialog(templateRef: TemplateRef<any>) {
    this.dialogRef = this.dialog.open(templateRef);
  }
  public addStatus() {
    this.spinner.show();
    this.listService.CreateLookupValue(this.fg.value).subscribe(
      (res) => {
        this.dialogRef.close();
        this.fg.reset();
        this.getStudentStatus();
        this.spinner.hide();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
}
