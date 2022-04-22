import { Component, OnInit, TemplateRef } from "@angular/core";
import { Router } from "@angular/router";
import { ListService } from "../../services/list.service";
import { ChipRendererComponent } from "src/EliCamps/ag-grid/renderers/chip-renderer/chip-renderer.component";
import { AllCommunityModules, GridApi } from "@ag-grid-community/all-modules";
import { Keys, LookupEnum } from "src/EliCamps/common/lookup.enums";
import { LocalstorageService } from "src/EliCamps/services/localstorage.service";
import { MatDialog, MatDialogRef } from "@angular/material";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { DeleteConfirmationDialogComponent } from "../confirmation-dialog/delete-confirmation-dialog.component";
import { ButtonRendererComponent } from "src/EliCamps/ag-grid/renderers/button-renderer.component";

@Component({
  selector: "app-student-status",
  templateUrl: "./student-status.component.html",
  styleUrls: ["./student-status.component.css"],
})
export class StudentStatusComponent implements OnInit {
  public columnDefs = [
    {
      name: "Name",
      field: "name",
      width: 300,
      editable:true
    },
    {
      name: "Description",
      field: "description",
      editable:true
    },
  ];
  public gridOptions: any;
  public info: string;
  private gridApi: GridApi;
  public StudentStatusList = [];
  public modules = AllCommunityModules;
  public gridColumnApi: any;
  public fg: FormGroup
  constructor(
    public router: Router,
    public listService: ListService,
    public storage: LocalstorageService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<any>,
    public fb: FormBuilder,
    public spinner: NgxSpinnerService
  ) {
    this.gridOptions = {
      frameworkComponents: {
        chiprenderer: ChipRendererComponent,
      },
      pagination: true,
      paginationAutoPageSize: true,
    };
  }
  ngOnInit() {
    this.fg = this.fb.group({
      name: [''],
      description: [''],
      lookupTableId: [1011]
    });
    this.gridOptions = {
      frameworkComponents: {
        buttonRenderer: ButtonRendererComponent
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
      width: 80
    };
    this.columnDefs=[...this.columnDefs, buttonRenderer as any];
  }
  openRemoveStudentStatusDialog(student: any): void {
    // tslint:disable-next-line: no-use-before-declare
    this.dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '250px',
      data: { headerName: `${student.rowData.name}` }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteStatus(student.rowData);
      }
    });
  }
  public deleteStatus(row: any) {
    this.spinner.show();
    this.listService.DeleteLookupValue(row).subscribe(res => {
      this.getStudentStatus();
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    })
  }
  public getStudentStatus = () => {
    this.listService.getAll(LookupEnum.STUDENT_STATUS).subscribe((res) => {
      this.StudentStatusList = res;
    });
  };
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getStudentStatus();
  }

  onFilterTextBoxChanged(event) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }
  onCellValueChanged(row) {
    const model = {
      ...row.data,
      [row.colDef.field]: row.newValue,
    };
    this.listService.UpdateLookupValue(model).subscribe((res) => {
      this.storage.set(Keys.REG_FEE, model.description);
    });
  }
  public openDialog(templateRef: TemplateRef<any>) {
   this.dialogRef = this.dialog.open(templateRef)
  }
  public addStatus() {
    this.spinner.show();
    this.listService.CreateLookupValue(this.fg.value).subscribe(res => {
      this.dialogRef.close();
      this.fg.reset();
      this.getStudentStatus();
      this.spinner.hide();
    }, error => {
      this.spinner.hide();
    })
  }
}
