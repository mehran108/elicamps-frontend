import { Component, OnInit } from '@angular/core';
import { GROUPS_COL_DEFS, STUDENT_COL_DEFS } from 'src/EliCamps/common/elicamps-column-definitions';
import { Group, Student } from 'src/EliCamps/EliCamps-Models/Elicamps';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import { GroupService } from 'src/EliCamps/services/group.service';
import { Router } from '@angular/router';
import { ChipRendererComponent } from 'src/EliCamps/ag-grid/renderers/chip-renderer/chip-renderer.component';
import { ButtonRendererComponent } from 'src/EliCamps/ag-grid/renderers/button-renderer.component';
import { ConfirmationDialogComponent } from './student-registration/confirmation-dialog/confirmation-dialog.component';
import { MatDialogRef, MatDialog, MatSelectChange } from '@angular/material';
import { ListService } from 'src/EliCamps/services/list.service';
import { DeleteConfirmationDialogComponent } from '../confirmation-dialog/delete-confirmation-dialog.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { LookupEnum } from 'src/EliCamps/common/lookup.enums';
import { AllModules } from "@ag-grid-enterprise/all-modules";

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  public columnDefs = STUDENT_COL_DEFS;
  public rowData: any[];
  public gridOptions: any;
  public info: string;
  private gridApi: any;
  public studentList: Student[] = [];
  public gridColumnApi: any;
  public modules = AllModules;
  public statusList = [];
  public selectedStatus= 'Active';
  public defaultColDef;
  constructor(
    private groupService: GroupService,
    public router: Router,
    public confirmationDialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    public dialog: MatDialog,
    public listService: ListService,
    public spinner: NgxSpinnerService) {

  }

  ngOnInit() {
    const buttonRenderer = {
      headerName: '',
      field: 'cancel',
      cellRenderer: 'buttonRenderer',
      cellRendererParams: {
        onClick: this.openRemoveStudentDialog.bind(this),
      },
      pinned: 'right',
      width: 80
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
        buttonRenderer: ButtonRendererComponent
      },
      pagination: true,
      paginationAutoPageSize: true,
    };
    this.listService.getAll(LookupEnum.STUDENT_STATUS).subscribe(res => {
      this.statusList = res;
    });
  }
  openRemoveStudentDialog(student: any): void {
    // tslint:disable-next-line: no-use-before-declare
    this.confirmationDialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '250px',
      data: { headerName: `${student.rowData.firstName} ${student.rowData.lastName}` }
    });

    this.confirmationDialogRef.afterClosed().subscribe(result => {
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
    this.listService.deleteStudent(row).subscribe(res => {
      this.spinner.hide();
      this.getStudentList();
    }, error => {
      this.spinner.hide();
    });
  }
  /**
   * Get Group List
   */
  public getStudentList = () => {
    const params = {
      active: true
    };
    this.groupService.getAllElicampsStudents(params).subscribe((studentList: Student[]) => {
      this.studentList = ((studentList as any).data || []).sort((a, b) => a.active > b.active ? -1 : 0);
      this.studentList = this.studentList.map(row => {
        return {
          ...row,
          status: this.getStatus(row)
        }
      });
      let changedEvent: MatSelectChange = {
        source: null,
        value: this.selectedStatus
      }
      this.filterStudents(changedEvent);
      this.autoSizeAll(false);
    });
  }
  public getStatus(row) {
    const statusRow = this.statusList.find(el => el.id === row.statusId);
    if (row.programeEndDate && new Date(row.programeEndDate) <= new Date()) {
      return 'Past'
    } else if (statusRow) {
      return statusRow.name;
    } else {
      return 'Active'
    }
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    this.getStudentList();
  }

  onFilterTextBoxChanged(event) {
    this.gridOptions.api.setQuickFilter(event.target.value);
  }
  autoSizeAll(skipHeader) {
    const allColumnIds = [];
    this.gridColumnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.colId);
    });
    this.gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  }
  onCellClicked($event) {

    this.router.navigate(['registerStudent'], {
      queryParams: {
        studentId: btoa($event.data.id.toString())
      }
    });

  }
  onBtnExport(): void {
    this.listService.exportGridData(this.gridApi, 'Students')
  }
  filterStudents(changeEvent: MatSelectChange) {
    if (changeEvent.value) {
      const list = this.studentList.filter(row => row.status === changeEvent.value);
      this.gridApi.setRowData(list);
    } else {
      this.gridApi.setRowData(this.studentList);
    }
  }
}
