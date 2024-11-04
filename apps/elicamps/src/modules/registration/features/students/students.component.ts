/* eslint-disable @nx/enforce-module-boundaries */
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MatDialogRef, MatDialog } from "@angular/material/dialog";
import { NgxSpinnerService } from "ngx-spinner";
import { MatSelectChange } from "@angular/material/select";
import { GridApi } from "ag-grid-community";
import { ButtonRendererComponent } from "apps/elicamps/src/ag-grid/renderers/button-renderer.component";
import { ChipRendererComponent } from "apps/elicamps/src/ag-grid/renderers/chip-renderer/chip-renderer.component";
import { STUDENT_COL_DEFS } from "apps/elicamps/src/common/elicamps-column-definitions";
import { LookupEnum, generateCertificat } from "apps/elicamps/src/common/lookup.enums";
import { Student } from "apps/elicamps/src/models/Elicamps";
import { GroupService } from "apps/elicamps/src/services/group.service";
import { ListService } from "apps/elicamps/src/services/list.service";
import { LocalstorageService } from "apps/elicamps/src/services/localstorage.service";
import { DeleteConfirmationDialogComponent } from "../../../common/features/confirmation-dialog/delete-confirmation-dialog.component";

@Component({
  selector: "app-students",
  templateUrl: "./students.component.html",
  styleUrls: ["./students.component.css"],
})
export class StudentsComponent implements OnInit {
  public columnDefs: any = STUDENT_COL_DEFS;
  public isSelectAll = false;
  public rowData!: any[];
  public gridOptions: any;
  public info!: string;
  private gridApi!: GridApi;
  public studentList: any = [];
  public gridColumnApi: any;
  public statusList: any = [];
  public selectedStatus = "Active";
  public rowSelection: any = 'multiple';
  public defaultColDef: any;
  constructor(
    private groupService: GroupService,
    public router: Router,
    public confirmationDialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    public dialog: MatDialog,
    public listService: ListService,
    public spinner: NgxSpinnerService,
    public storage: LocalstorageService
  ) {}

  ngOnInit() {
    const buttonRenderer = {
      headerName: "",
      field: "cancel",
      cellRenderer: "buttonRenderer",
      cellRendererParams: {
        onClick: this.openRemoveStudentDialog.bind(this),
      },
      pinned: "right",
      width: 80,
    };
    this.columnDefs = [];
    this.columnDefs.push(...STUDENT_COL_DEFS, buttonRenderer as any);
    this.defaultColDef = {
      resizable: true,
      sortable: true,
      filter: true,
    };
    this.gridOptions = {
      frameworkComponents: {
        chiprenderer: ChipRendererComponent,
        buttonRenderer: ButtonRendererComponent,
      },
      pagination: true,
      paginationAutoPageSize: true,
    };
    this.listService.getAll(LookupEnum.STUDENT_STATUS).subscribe((res) => {
      this.statusList = res;
    });
  }
  openRemoveStudentDialog(student: any): void {
    // tslint:disable-next-line: no-use-before-declare
    this.confirmationDialogRef = this.dialog.open(
      DeleteConfirmationDialogComponent,
      {
        width: "250px",
        data: {
          headerName: `${student.rowData.firstName} ${student.rowData.lastName}`,
        },
      }
    );

    this.confirmationDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.delete(student.rowData);
      }
    });
  }
  delete(rowData: any) {
    const row = {
      id: rowData.id,
      isDelete: true,
    };
    this.spinner.show();
    this.listService.deleteStudent(row).subscribe(
      (res) => {
        this.spinner.hide();
        this.getStudentList();
      },
      (error) => {
        this.spinner.hide();
      }
    );
  }
  /**
   * Get Group List
   */
  public getStudentList = () => {
    const params = {
      active: true,
    };
    this.groupService
      .getAllElicampsStudents(params)
      .subscribe((studentList: any) => {
        this.studentList = ((studentList as any).data || []).sort((a: any, b: any) =>
          a.active > b.active ? -1 : 0
        );
        this.studentList = this.studentList.map((row: any) => {
          return {
            ...row,
            status: this.getStatus(row),
          };
        });
        const changedEvent: any = {
          source: null,
          value: this.selectedStatus,
        };
        this.filterStudents(changedEvent);
        this.autoSizeAll(false);
      });
  };
  public getStatus(row: any) {
    const statusRow = this.statusList.find((el: any) => el['id'] === row.statusId);
    if (row.statusId !== 1030 && row.programeEndDate && new Date(row.programeEndDate) <= new Date()) {
      return "Past";
    } else if (statusRow) {
      return statusRow['name'];
    } else if (row.active) {
      return "Active";
    } else {
      return "Inactive";
    }
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getStudentList();
  }

  onFilterTextBoxChanged(event: any) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }
  autoSizeAll(skipHeader: any) {
    const allColumnIds: any = [];
    this.gridColumnApi.getAllColumns().forEach((column: any) => {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }
  onCellClicked($event: any) {
    this.router.navigate(["registerStudent"], {
      queryParams: {
        studentId: btoa($event.data.id.toString()),
      },
    });
  }
  onBtnExport(): void {
    this.listService.exportGridData(this.gridApi, "Students");
  }
  filterStudents(changeEvent: MatSelectChange) {
    if (changeEvent.value) {
      const list = this.studentList.filter(
        (row: any) => row.status === changeEvent.value
      );
      this.gridApi.setGridOption('rowData', list);
    } else {
      this.gridApi.setGridOption('rowData', this.studentList);
    }
  }
  exportCertificate() {
    this.storage.loading.next(true);
    const studentNodes = this.gridApi.getSelectedNodes();
    const students = studentNodes.map(row => row.data);
    const studentNames = students.map((row) => row.firstName+row.lastName);
    generateCertificat(studentNames, this.storage);
    return;
    // const model = {
    //   studentNames: studentNames,
    // };
    // this.groupService.exportCertifcate(model).subscribe((res) => {
    //   const blob = new Blob([res], {
    //     type: "application/zip",
    //   });
    //   const url = URL.createObjectURL(blob);
    //   const link = document.createElement('a');
    //   link.href = url;
    //   link.setAttribute('download', 'Student-Certifcates');
    //   document.body.appendChild(link);
    //   link.click();
    // });
  }
  onSelectAll() {
    this.gridApi.selectAll();
    this.isSelectAll = true;
  }
  onDeSelectAll() {
    this.gridApi.deselectAll();
    this.isSelectAll = false;
  }
}
